import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { License } from "src/typeorm/License.entity";
import { Product } from "src/typeorm/Product.entity";
import { ProductVersion } from "src/typeorm/ProductVersion";
import { PromoEntity } from "src/typeorm/Promo.entity";
import { SYSTEM_ROLES, User } from "src/typeorm/User.entity";
import { Repository } from "typeorm";
import { ProductDTO } from "./dto/product.dto";
import { VersionDTO } from "./dto/version.dto";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVersion)
    private readonly versionRepository: Repository<ProductVersion>,
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
  ) {}

  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        versions: true,
        licenses: true,
        admins: true,
        supports: true,
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }
  
  async getKeys(user: User, productId: number): Promise<PromoEntity[]> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: { promos: true, supports: true, admins: true }
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const isAuthorized = [...product.admins, ...product.supports].some(staff => staff.discordId === user.discordId);

    if (!isAuthorized) {
      throw new ForbiddenException('User is not authorized to view keys');
    }

    return product.promos;
  }

  async getLicensesByProductId(user: User, id: number): Promise<License[]> {
    
    console.log(id)
    
    const query = this.licenseRepository
      .createQueryBuilder('license')
      .leftJoinAndSelect('license.product', 'product')
      .innerJoinAndMapOne('license.user', User, 'user', 'license.userId = user.discordId')
      .where('product.id = :id', { id });

    if (SYSTEM_ROLES.includes(user.role)) {
      return query.getMany();
    }

    const userProducts = await Promise.all([
      user.productAdmin,
      user.productSupport
    ]);

    return query
      .andWhere('product.id IN (:...productIds)', { productIds: userProducts.flat().map(product => product.id) })
      .getMany();
  }

  async getProducts(user: User): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect('product.versions', 'versions')
      .leftJoinAndSelect('product.licenses', 'licenses');

    if (!SYSTEM_ROLES.includes(user.role)) {
      const userProducts = await Promise.all([
        user.productAdmin,
        user.productSupport
      ]);
      const productIds = userProducts.flat().map(product => product.id);
      query.whereInIds(productIds);
    }

    return query.getMany()
  }

  async getVersion(id: number): Promise<ProductVersion> {
    const version = await this.versionRepository.findOne({
      where: { id },
      relations: {
        product: true,
      },
    });

    if (!version) {
      throw new NotFoundException();
    }

    return version;
  }

  async createProduct(productDTO: ProductDTO): Promise<Product> {
    const product = this.productRepository.create({
      ...productDTO,
      versions: [],
    });

    return await this.productRepository.save(product);
  }

  async updateProduct(id: number, productDTO: ProductDTO): Promise<Product> {
    const product = await this.getProduct(id);
    return await this.productRepository.save({ ...product, ...productDTO });
  }

  async createVersion(versionDto: VersionDTO): Promise<ProductVersion[]> {
    const product = await this.getProduct(versionDto.productId)
    const version = this.versionRepository.create({ ...versionDto, product });

    await this.versionRepository.save(version);

    return [...product.versions, version];
  }

  async deleteVersion(id: number): Promise<Product> {
    const product = await this.getProduct(id)
    await this.versionRepository.delete({ id });

    return product
  }

  async updateVersion(
    id: number,
    versionDto: VersionDTO,
  ): Promise<ProductVersion> {
    const version = await this.getVersion(id);

    return await this.versionRepository.save({
      ...version,
      config: versionDto.config,
      version: versionDto.version,
    });
  }

}

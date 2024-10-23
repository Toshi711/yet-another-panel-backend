import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { License } from "src/typeorm/License.entity";
import { Product } from "src/typeorm/Product.entity";
import { SYSTEM_ROLES, User } from "src/typeorm/User.entity";
import { DeleteResult, Repository } from "typeorm";
import { LicenseDTO } from "./dto/license.dto";

@Injectable()
export class LicensesService {
  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  getLicenseByKey(license: string) {
    return this.licenseRepository.findOne({ where: { key: license } });
  }

  async deleteLicense(user: User, id: number): Promise<DeleteResult> {
    return this.licenseRepository
      .createQueryBuilder("license")
      .where("license.id = :id", { id })
      .delete()
      .execute();
  }

  async getUserLicenses(user: User, discordId: string): Promise<License[]> {
    const query = this.licenseRepository
      .createQueryBuilder("license")
      .leftJoinAndSelect("license.product", "product")
      .leftJoinAndSelect("product.versions", "versions")
      .leftJoinAndSelect("license.currentProductVersion", "currentProductVersion");

    if (user.discordId === discordId || SYSTEM_ROLES.includes(user.role)) {
      query.where("license.userId = :discordId", { discordId });
    } else {
      const userProducts = await Promise.all([
        user.productAdmin,
        user.productSupport
      ]);
      const productIds = userProducts.flat().map(product => product.id);
      query.where("product.id IN (:...productIds)", { productIds });
    }

    return query.getMany();
  }

  async createLicense(creator: User, licenseDTO: LicenseDTO): Promise<License> {
    const product = await this.productRepository.findOneBy({ id: licenseDTO.productId });

    if (!product) {
      throw new NotFoundException("Product does not exist");
    }

    const newLicense = this.licenseRepository.create({
      creatorId: creator.discordId,
      userId: licenseDTO.userId,
      serverId: licenseDTO.serverId,
      timeAmount: licenseDTO.timeAmount,
      product,
      key: randomUUID(),
    });

    return this.licenseRepository.save(newLicense);
  }
}

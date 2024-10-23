import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductsService } from "src/modules/products/products.service";
import { Product } from "src/typeorm/Product.entity";
import { User, UserRoles } from "src/typeorm/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly productService: ProductsService,
  ) {}

  private removeUser = (user: User, staffList: User[]) => staffList.filter(staff => staff.discordId !== user.discordId);

  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { discordId: id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
  
  async appointUserToProduct(
    userId: string,
    productId: number,
    role: UserRoles,
  ): Promise<Product> {
    if (![UserRoles.ProductAdmin, UserRoles.ProductSupport].includes(role)) {
      throw new ForbiddenException('Invalid role for product appointment');
    }

    const [user, product] = await Promise.all([
      this.getUser(userId),
      this.productService.getProduct(productId),
    ]);

    const isAlreadyAssigned = product.supports.concat(product.admins)
      .some(staff => staff.discordId === user.discordId);

    if (isAlreadyAssigned) {
      throw new ForbiddenException('User is already assigned to this product');
    }

    const staffList = role === UserRoles.ProductSupport ? product.supports : product.admins;
    staffList.push(user);

    await this.productRepository.save(product)

    return product;
  }

  async deleteUserFromProduct(userId: string, productId: number): Promise<Product> {
    const [user, product] = await Promise.all([
      this.getUser(userId),
      this.productService.getProduct(productId),
    ]);

    product.supports = this.removeUser(user, product.supports);
    product.admins = this.removeUser(user, product.admins);

    const updatedProduct = await this.productRepository.save(product);

    // Reset user role if they're no longer associated with any product
    if (![...product.supports, ...product.admins].some(staff => staff.discordId === user.discordId)) {
      user.role = UserRoles.User;
      await this.userRepository.save(user);
    }

    return updatedProduct;
  }
}

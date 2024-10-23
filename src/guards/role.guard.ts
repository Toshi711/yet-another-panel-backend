import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/typeorm/Product.entity";
import { UserRoles } from "src/typeorm/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return false;

    const requiredRoles = this.reflector.get<UserRoles[]>('roles', context.getHandler()) || [];
    
    if (requiredRoles.includes(user.role)) return true;

    let productId: string | undefined;

    if (request.method === 'GET') {
      productId = request.params.productId || request.query.productId;
    } else {
      productId = request.body.productId;
    }

    if (!productId) return false;

    const product = await this.productRepository.findOne({
      where: { id: parseInt(productId) },
      relations: ['supports', 'admins'],
    });

    if (!product) return false;

    request.product = product;

    const isProductAdmin = product.admins?.some(admin => admin.discordId === user.discordId);
    const isProductSupport = product.supports?.some(support => support.discordId === user.discordId);

    return (
      (requiredRoles.includes(UserRoles.ProductAdmin) && isProductAdmin) ||
      (requiredRoles.includes(UserRoles.ProductSupport) && isProductSupport)
    );
  }
}

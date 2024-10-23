import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffController } from "./users.controller";
import { ProductsService } from "src/modules/products/products.service";
import { User } from "src/typeorm/User.entity";
import { Config } from "src/typeorm/Config.entity";
import { License } from "src/typeorm/License.entity";
import { Product } from "src/typeorm/Product.entity";
import { Session } from "src/typeorm/Session.entity";
import { UserService } from "./users.service";
import { ProductVersion } from "src/typeorm/ProductVersion";
import { PromoEntity } from "src/typeorm/Promo.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Config,
      License,
      Product,
      ProductVersion,
      Session,
      PromoEntity
    ]),
  ],
  providers: [UserService, ProductsService],
  controllers: [StaffController],
})
export class UsersModule {}

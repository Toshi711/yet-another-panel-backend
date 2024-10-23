import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Config } from "src/typeorm/Config.entity";
import { Product } from "src/typeorm/Product.entity";
import { User } from "src/typeorm/User.entity";
import { License } from "src/typeorm/License.entity";
import { Session } from "src/typeorm/Session.entity";
import { ProductVersion } from "src/typeorm/ProductVersion";
import { StaffService } from "./staff.service";
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
  providers: [ProductsService, StaffService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}

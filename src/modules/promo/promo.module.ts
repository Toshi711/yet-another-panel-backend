import { Module } from "@nestjs/common";
import { PromoService } from "./promo.service";
import { PromoController } from "./promo.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { License } from "src/typeorm/License.entity";
import { PromoEntity } from "src/typeorm/Promo.entity";
import { Product } from "src/typeorm/Product.entity";

@Module({
  imports: [TypeOrmModule.forFeature([License, PromoEntity, Product])],
  providers: [PromoService],
  controllers: [PromoController],
})
export class PromoModule {}

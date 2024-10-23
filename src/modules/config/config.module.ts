import { Module } from "@nestjs/common";
import { ConfigController } from "./config.controller";
import { LicensesService } from "../licenses/licenses.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm/User.entity";
import { Config } from "src/typeorm/Config.entity";
import { License } from "src/typeorm/License.entity";
import { Product } from "src/typeorm/Product.entity";
import { Session } from "src/typeorm/Session.entity";
import { ConfiguratorService } from "./config.service";
import { ProductVersion } from "src/typeorm/ProductVersion";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Config,
      License,
      Product,
      Session,
      ProductVersion,
    ]),
  ],
  controllers: [ConfigController],
  providers: [ConfiguratorService, LicensesService],
})
export class ConfigModule {}

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./typeorm/User.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { OAuth2 } from "./typeorm/OAuth.entity";
import { ProductsModule } from "./modules/products/products.module";
import { License } from "./typeorm/License.entity";
import { Product } from "./typeorm/Product.entity";
import { Config } from "./typeorm/Config.entity";
import { DataSource } from "typeorm";
import { Session } from "./typeorm/Session.entity";
import { UsersModule } from "./modules/users/users.module";
import { ConfigModule as Configurator } from "./modules/config/config.module";
import { LicensesModule } from "./modules/licenses/licenses.module";
import { DiscordModule } from "./modules/discord/discord.module";
import { ProductVersion } from "./typeorm/ProductVersion";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { PromoModule } from "./modules/promo/promo.module";
import { PromoEntity } from "./typeorm/Promo.entity";

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ envFilePath: ".env" }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "sqlite.db",
      entities: [
        User,
        OAuth2,
        License,
        Product,
        ProductVersion,
        Config,
        Session,
        PromoEntity,
      ],
      synchronize: true,
    }),
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          url: configService.get("REDIS_URL"),
        });
        return {
          store: () => store,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Session]),
    ProductsModule,
    LicensesModule,
    UsersModule,
    ConfigModule,
    Configurator,
    DiscordModule,
    PromoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  getDataSource() {
    return this.dataSource;
  }
}

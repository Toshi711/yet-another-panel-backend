import { Module } from "@nestjs/common";
import { DiscordService } from "./discord.service";
import { DiscordController } from "./discord.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm/User.entity";
import { OAuth2 } from "src/typeorm/OAuth.entity";
import { HttpModule } from "@nestjs/axios";
import { License } from "src/typeorm/License.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, OAuth2, License]), HttpModule],
  providers: [DiscordService],
  controllers: [DiscordController],
})
export class DiscordModule {}

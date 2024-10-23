import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/typeorm/User.entity";
import { OAuth2 } from "src/typeorm/OAuth.entity";
import { DiscordStrategy } from "./strategies/discord.strategy";
import { ConfigModule } from "@nestjs/config";
import { SessionSerializer } from "./strategies/serialize";
import { Session } from "src/typeorm/Session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, OAuth2, Session]), ConfigModule],
  providers: [DiscordStrategy, SessionSerializer, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

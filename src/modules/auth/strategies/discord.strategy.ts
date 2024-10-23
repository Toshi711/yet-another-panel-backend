import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Strategy, Profile } from "passport-discord";
import { AuthService } from "../auth.service";
import { Done } from "utils/types";
import * as crypto from "bcrypt";
import { ConfigService } from "@nestjs/config";
import { User } from "src/typeorm/User.entity";

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get("CLIENT_ID"),
      clientSecret: configService.get("CLIENT_SECRET"),
      callbackURL: configService.get("CLIENT_REDIRECT"),
      scope: ["identify", "email", "guilds"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Done,
  ) {
    const { id: discordId, username, email, global_name, avatar } = profile;
    const user = await this.authService.validateUser({
      discordId,
      email,
      username,
      globalName: global_name,
      avatar,
    });
    await this.authService.validateOAuth2({
      discordId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    done(null, user as User);
  }
}

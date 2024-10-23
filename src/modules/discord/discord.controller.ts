import { Controller, Get, Param } from "@nestjs/common";
import { DiscordService } from "./discord.service";
import { GetUser } from "src/decorators/User.decorator";
import { User } from "src/typeorm/User.entity";

@Controller("discord")
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Get("guild/:licence")
  async getGuild(@GetUser() user: User, @Param("licence") id: number) {
    return await this.discordService.getGuildInfo(user, id);
  }
}

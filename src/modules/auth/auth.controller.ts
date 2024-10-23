import { Controller, Get, Post, Redirect, Req, UseGuards } from "@nestjs/common";
import {
  AuthenticatedGuard,
  DiscordAuthGuard,
} from "../../guards/discord.guard";
import { Request } from "express";
import { GetUser } from "src/decorators/User.decorator";
import { User } from "src/typeorm/User.entity";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async getMe(@GetUser() user: User){
    return user
  }

  @Get("/jwt")
  @UseGuards(AuthenticatedGuard)
  async status(@GetUser() user: User) {
    return await this.authService.findOAuth2ByDiscordId(user.discordId);
  }

  @Get("discord/redirect")
  @UseGuards(DiscordAuthGuard)
  async redirect(@GetUser() user: User) {
    return true;
  }

  @Get("login")
  @UseGuards(DiscordAuthGuard)
  async login() {
    return true;
  }

  @UseGuards(AuthenticatedGuard)
  @Post("logout")
  async logout(@Req() request: Request){
    (request as any).logout(() => {}) 
    return true
  }
}

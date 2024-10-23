import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { GetUser } from "src/decorators/User.decorator";
import { User } from "src/typeorm/User.entity";
import { ConfiguratorService } from "./config.service";
import { AuthenticatedGuard } from "src/guards/discord.guard";
import { number } from "ajv-ts";

@Controller("config")
export class ConfigController {
  constructor(private readonly configService: ConfiguratorService) {}

  @UseGuards(AuthenticatedGuard)
  @Get("/:id")
  async getLicenseConfig(
    @GetUser() user: User,
    @Param("id") licenseId: number,
  ) {
    return await this.configService.getLicenseConfig(user, licenseId);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch("/")
  async changeProductVersion(
    @GetUser() user: User,
    @Body("versionId") versionId: number,
    @Body("licenseId") licenseId: number,
  ) {
    return await this.configService.changeVersion(user, licenseId, versionId);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch("/server")
  async changeServer(
    @GetUser() user: User,
    @Body("licenseId") licenseId: number,
    @Body("serverId") serverId: string,
  ) {
    return await this.configService.changeServer(user, licenseId, serverId);
  }

  @UseGuards(AuthenticatedGuard)
  @Patch("/token")
  async changeToken(
    @GetUser() user: User,
    @Body("licenseId") licenseId: number,
    @Body("token") token: string,
  ) {
    return await this.configService.changeToken(user, licenseId, token);
  }

  @UseGuards(AuthenticatedGuard)
  @Post("/:id")
  async updateLicenseConfig(
    @GetUser() user: User,
    @Param("id") id: number,
    @Body("config") config: string,
  ) {
    return await this.configService.updateConfig(user, id, config);
  }
}

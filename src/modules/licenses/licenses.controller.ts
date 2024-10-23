import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { LicensesService } from "./licenses.service";
import { GetUser } from "src/decorators/User.decorator";
import { User, UserRoles } from "src/typeorm/User.entity";
import { LicenseDTO } from "./dto/license.dto";
import { Access } from "src/decorators/Roles.decorator";
import { AuthenticatedGuard } from "src/guards/discord.guard";

@Controller("licenses")
export class LicensesController {
  constructor(private readonly licenseService: LicensesService) {}

  @UseGuards(AuthenticatedGuard)
  @Get("/:id")
  async getLicenses(@GetUser() user: User, @Param("id") id: string) {
    return await this.licenseService.getUserLicenses(user, id);
  }

  @Access([
    UserRoles.Developer,
    UserRoles.ProductAdmin,
    UserRoles.ProductSupport,
    UserRoles.SystemAdmin,
    UserRoles.SystemSupport,
  ])
  @Delete("/:productId/:licenseId")
  async deleteLicense(@GetUser() user: User, @Param("licenseId") id: number) {
    return await this.licenseService.deleteLicense(user, id);
  }

  @Access([UserRoles.Developer, UserRoles.SystemAdmin, UserRoles.ProductAdmin])
  @Post("/")
  async createLicense(@GetUser() user: User, @Body() license: LicenseDTO) {
    return await this.licenseService.createLicense(user, license);
  }
}

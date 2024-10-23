import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Access } from "src/decorators/Roles.decorator";
import { GetUser } from "src/decorators/User.decorator";
import { User, UserRoles } from "src/typeorm/User.entity";
import { PromoService } from "./promo.service";
import { PromoDTO } from "./dto/promo.dto";

@Controller("promo")
export class PromoController {
  constructor(private readonly promoService: PromoService) {}

  @Access([UserRoles.Developer, UserRoles.SystemAdmin, UserRoles.ProductAdmin])
  @Post("/")
  async createPromo(@GetUser() user: User, @Body() promo: PromoDTO) {
    return await this.promoService.createKey(
      user,
      promo.productId,
      promo.timeAmount,
    );
  }

  @Post("/:key")
  async activatePromo(@GetUser() user: User, @Param("key") key: string) {
    return await this.promoService.activateKey(user, key);
  }

  @Delete('/:productId/:key')
  async deleteKey(@GetUser() user: User, @Param('key') keyId: number){
    return await this.promoService.deleteKey(user, keyId)
  }
}

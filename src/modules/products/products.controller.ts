import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post
} from "@nestjs/common";
import { Access } from "src/decorators/Roles.decorator";
import { GetUser } from "src/decorators/User.decorator";
import { User, UserRoles } from "src/typeorm/User.entity";
import { ProductDTO } from "./dto/product.dto";
import { VersionDTO } from "./dto/version.dto";
import { ProductsService } from "./products.service";
import { StaffService } from "./staff.service";

@Controller("products")
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly staffService: StaffService
  ) {}

  @Get("/")
  async getProducts(@GetUser() user: User) {
    return await this.productService.getProducts(user);
  }

  @Get("/:productId")
  async getProduct(@Param("productId") id: number) {
    return await this.productService.getProduct(id);
  }

  @Get("/:productId/licenses")
  async getProductLicenses(@GetUser() user: User, @Param("productId") id: number) {
    return await this.productService.getLicensesByProductId(user, id);
  }

  @Get("/:productId/keys")
  async getKeysLicenses(@GetUser() user: User, @Param("productId") id: number) {
    return await this.productService.getKeys(user, id);
  }

  @Access([UserRoles.Developer, UserRoles.SystemAdmin])
  @Post("/")
  async createProduct(@Body() productDTO: ProductDTO) {
    return await this.productService.createProduct(productDTO);
  }

  @Access([UserRoles.Developer, UserRoles.SystemAdmin])
  @Post("/version")
  async createVersion(@Body() versionDto: VersionDTO) {
    return await this.productService.createVersion(versionDto);
  }

  @Access([UserRoles.Developer, UserRoles.SystemAdmin])
  @Patch("/:productId")
  async updateProduct(@Param("productId") id: number, @Body() productDTO: ProductDTO) {
    return await this.productService.updateProduct(id, productDTO);
  }

  @Access([UserRoles.Developer, UserRoles.SystemAdmin])
  @Patch("/version/:id")
  async updateVersion(@Param("id") id: number, @Body() versionDto: VersionDTO) {
    return await this.productService.updateVersion(id, versionDto);
  }

  @Access([UserRoles.Developer, UserRoles.SystemAdmin])
  @Delete("/version/:id")
  async deleteVersion(@Param("id") id: number) {
    return await this.productService.deleteVersion(id);
  }

  @Access([UserRoles.Developer, UserRoles.SystemAdmin])
  @Post("/:productId/staff")
  async appointToProduct(@Body('productId') productId: number, @Body('userId') userId: string, @Body('role') role: UserRoles) {
    await this.staffService.appointUserToProduct(userId,productId,role);
  } 

  @Access([UserRoles.Developer, UserRoles.SystemAdmin])
  @Delete("/:productId/staff")
  async deleteFromProduct(@Body('productId') productId: number, @Body('userId') userId: string,) {
    await this.staffService.deleteUserFromProduct(userId, productId);
  }
}

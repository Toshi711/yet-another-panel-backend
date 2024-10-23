import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Access } from "src/decorators/Roles.decorator";
import { UserRoles } from "src/typeorm/User.entity";
import { UserService } from "./users.service";

@Controller("users")
export class StaffController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(){
    return await this.userService.getUsers()
  }
  
  @Get("/:id")
  async getUser(@Param("id") id: string) {
    return this.userService.getUser(id);
  }

  @Access([UserRoles.Developer])
  @Post("/role")
  async appoint(@Body("userId") id: string, @Body("role") role: UserRoles) {
    return await this.userService.appointUser(id, role);
  }
}

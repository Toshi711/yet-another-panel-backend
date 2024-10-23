import { SetMetadata, UseGuards, applyDecorators } from "@nestjs/common";
import { AuthenticatedGuard } from "src/guards/discord.guard";
import { RoleGuard } from "src/guards/role.guard";

export const Access = (roles: string[]) =>
  applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthenticatedGuard),
    UseGuards(RoleGuard),
  );

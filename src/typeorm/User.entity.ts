import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Product } from "./Product.entity";
import { Config } from "./Config.entity";

export enum UserRoles {
  Developer = "developer",
  SystemAdmin = "admin",
  SystemSupport = "support",
  ProductSupport = "product_support",
  ProductAdmin = "product_admin",
  User = "user",
}

export const SYSTEM_ROLES: string[] = [
  UserRoles.Developer,
  UserRoles.SystemAdmin,
  UserRoles.SystemSupport,
];

@Entity()
export class User {
  @PrimaryColumn()
  discordId: string;

  @Column()
  username: string;

  @Column()
  globalName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column()
  email: string;

  @Column({ nullable: false, default: UserRoles.Developer })
  role: UserRoles;

  @ManyToMany(() => Product, (product) => product.supports, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  productSupport: Promise<Product[]>;

  @ManyToMany(() => Product, (product) => product.admins, {
    onDelete: "CASCADE",
  })
  @JoinTable()
  productAdmin: Promise<Product[]>;

  @OneToMany(() => Config, (config) => config.user)
  configs: Config[];
}

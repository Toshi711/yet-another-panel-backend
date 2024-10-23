import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { License } from "./License.entity";
import { User } from "./User.entity";
import { ProductVersion } from "./ProductVersion";

@Entity()
export class Config {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  config: string;

  @ManyToOne(() => User, (user) => user.configs)
  user: User;

  @OneToOne(() => License, (license) => license.config)
  license: License;

  @OneToOne(() => ProductVersion)
  @JoinColumn()
  productVersion: ProductVersion;
}

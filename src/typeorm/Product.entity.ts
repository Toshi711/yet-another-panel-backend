import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User.entity";
import { License } from "./License.entity";
import { ProductVersion } from "./ProductVersion";
import { PromoEntity } from "./Promo.entity";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  download: string;

  @Column({ default: false })
  closed: boolean;

  @OneToMany(() => License, (license) => license.product)
  licenses: License[];

  @ManyToMany(() => User, (user) => user.productSupport)
  supports: User[];

  @ManyToMany(() => User, (user) => user.productAdmin)
  admins: User[];

  @OneToMany(() => ProductVersion, (version) => version.product)
  versions: ProductVersion[];

  @OneToMany(() => PromoEntity, promo => promo.product)
  promos: PromoEntity[]
  
  @CreateDateColumn()
  createdAt: Date;
}

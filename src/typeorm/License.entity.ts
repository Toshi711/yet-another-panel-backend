import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Product } from "./Product.entity";
import { Config } from "./Config.entity";
import { Exclude } from "class-transformer";
import { ProductVersion } from "./ProductVersion";

@Entity()
export class License {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  serverId: string;

  @Column({ nullable: true })
  token: string;

  @Exclude()
  @Column()
  key: string;

  @Column()
  timeAmount: number;

  @ManyToOne(() => Product, (product) => product.licenses)
  product: Product;

  @Column({ nullable: true })
  config: string;

  @ManyToOne(() => ProductVersion)
  currentProductVersion: ProductVersion;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

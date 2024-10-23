import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product.entity";

@Entity()
export class PromoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  createdBy: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  timeAmount: number;
}

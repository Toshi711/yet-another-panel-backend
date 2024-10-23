import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { randomUUID } from "crypto";
import { GetUser } from "src/decorators/User.decorator";
import { License } from "src/typeorm/License.entity";
import { Product } from "src/typeorm/Product.entity";
import { PromoEntity } from "src/typeorm/Promo.entity";
import { SYSTEM_ROLES, User } from "src/typeorm/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(PromoEntity)
    private readonly promoRepository: Repository<PromoEntity>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
  ) {}

  deleteKey(user: User, key: number) {
    return this.promoRepository.delete({id: key})
  }
  
  async createKey(user: User, productId: number, timeAmount: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException();
    }

    const promo = this.promoRepository.create({
      key: randomUUID(),
      createdBy: user.discordId,
      timeAmount,
    });

    promo.product = product;

    await this.promoRepository.save(promo);

    return promo;
  }

  async activateKey(@GetUser() user: User, key: string) {
    const promo = await this.promoRepository.findOne({
      where: { key },
      relations: { product: true },
    });

    if(!promo){
      throw new NotFoundException()
    }
    
    const newLicense = this.licenseRepository.create({
      creatorId: promo.createdBy,
      userId: user.discordId,
      timeAmount: promo.timeAmount,
      product: promo.product,
      key: randomUUID(),
    });

    await this.licenseRepository.save(newLicense);

    return newLicense;
  }
}

import {
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User, UserRoles } from "src/typeorm/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getUsers(){
    return this.userRepository.find()
  }
  
  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { discordId: id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async appointUser(id: string, role: UserRoles) {
    const user = await this.getUser(id);
    return await this.userRepository.save({ ...user, role });
  }
}

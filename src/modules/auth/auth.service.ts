import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OAuth2 } from "src/typeorm/OAuth.entity";
import { User } from "src/typeorm/User.entity";
import { Repository } from "typeorm";
import { OAuth2Details, UserDetails } from "utils/types";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(OAuth2) private oauth2Repository: Repository<OAuth2>,
  ) {}

  getUserInfoByDiscordId(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { discordId: id },
      relations: ["licenses", "productSupport", "productAdmin"],
    });
  }

  findUserByDiscordId(id: string) {
    return this.userRepository.findOne({ where: { discordId: id } });
  }

  async createUser(details: UserDetails) {
    const user = this.userRepository.create(details);
    return this.userRepository.save(user);
  }

  async updateUser(details: UserDetails) {
    await this.userRepository.update({ discordId: details.discordId }, details);
    return details;
  }

  async validateUser(details: UserDetails) {
    const user = await this.findUserByDiscordId(details.discordId);
    return user ? this.updateUser(details) : this.createUser(details);
  }

  async validateOAuth2(details: OAuth2Details) {
    const oauth2 = await this.findOAuth2ByDiscordId(details.discordId);
    return oauth2 ? this.updateOAuth2(details) : this.createOAuth2(details);
  }

  createOAuth2(details: OAuth2Details) {
    const user = this.oauth2Repository.create(details);
    return this.oauth2Repository.save(user);
  }

  async updateOAuth2(details: OAuth2Details) {
    await this.oauth2Repository.update(details.discordId, details);
    return details;
  }

  findOAuth2ByDiscordId(id: string) {
    return this.oauth2Repository.findOne({ where: { discordId: id } });
  }

  // Add logout function
  async logout(discordId: string) {
    // Logic to handle logout, e.g., invalidate session or token
    const user = await this.findUserByDiscordId(discordId);
    if (user) {
        // Perform logout actions, such as clearing tokens or session data
        // Example: user.token = null; 
        // await this.userRepository.save(user);
        return { message: "User logged out successfully." };
    }
    throw new Error("User not found.");
  }
}

import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Client, GatewayIntentBits } from "discord.js";
import { License } from "src/typeorm/License.entity";
import { User } from "src/typeorm/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class DiscordService {
  constructor(
    @InjectRepository(License)
    private readonly licenceRepository: Repository<License>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getGuildInfo(user: User, licenseId: number): Promise<string> {
    const license = await this.licenceRepository.findOne({
      where: { userId: user.discordId, id: licenseId },
      select: ['serverId', 'token']
    });

    if (!license?.token) {
      throw new NotFoundException('License not found or token is missing');
    }

    const cachedInfo = await this.cacheManager.get<string>(license.serverId);
    if (cachedInfo) {
      return cachedInfo;
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    try {
      await client.login(license.token);
      const guild = await client.guilds.fetch(license.serverId);

      const [channels, roles] = await Promise.all([
        guild.channels.fetch(),
        guild.roles.fetch()
      ]);

      const guildInfo = JSON.stringify({
        channels: channels.map(channel => ({
          id: channel.id,
          type: channel.type,
          name: channel.name,
        })),
        roles: roles.map(role => ({
          id: role.id,
          name: role.name,
          color: role.hexColor,
        })),
      });

      await this.cacheManager.set(guild.id, guildInfo, 100_000);
      return guildInfo;
    } finally {
      client.destroy();
    }
  }
}

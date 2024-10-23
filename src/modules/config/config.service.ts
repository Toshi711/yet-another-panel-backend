import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Ajv from "ajv";
import { License } from "src/typeorm/License.entity";
import { ProductVersion } from "src/typeorm/ProductVersion";
import { User } from "src/typeorm/User.entity";
import { Repository } from "typeorm";

@Injectable()
export class ConfiguratorService {
  private readonly ajv = new Ajv({ strict: "log" });

  constructor(
    @InjectRepository(License)
    private readonly licenseRepository: Repository<License>,
    @InjectRepository(ProductVersion)
    private readonly versionRepository: Repository<ProductVersion>,
  ) {
    this.ajv.addKeyword({ keyword: "_name", valid: true });
    this.ajv.addKeyword({ keyword: "_description", valid: true });
    this.ajv.addKeyword({ keyword: "_component", valid: true });
    this.ajv.addKeyword({ keyword: "_placeholder", valid: true });
    this.ajv.addKeyword({ keyword: "_grow", valid: true });
    this.ajv.addKeyword({ keyword: "_multi", valid: true });
  }

  // Helper methods
  private async getLicense(userId: string, licenseId: number, relations: string[] = []): Promise<License> {
    const license = await this.licenseRepository.findOne({
      where: { id: licenseId, userId },
      relations,
    });

    if (!license) {
      throw new NotFoundException('License not found');
    }

    return license;
  }

  private parseJSON(jsonString: string, defaultValue: any = {}): any {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return defaultValue;
    }
  }

  async changeServer(user: User, licenseId: number, serverId: string): Promise<License> {
    const license = await this.getLicense(user.discordId, licenseId);
    license.serverId = serverId;
    return this.licenseRepository.save(license);
  }

  async changeToken(user: User, licenseId: number, token: string): Promise<License> {
    const license = await this.getLicense(user.discordId, licenseId);
    license.token = token;
    return this.licenseRepository.save(license);
  }

  async changeVersion(user: User, licenseId: number, versionId: number): Promise<ProductVersion> {
    const license = await this.getLicense(user.discordId, licenseId, ['product']);

    const version = await this.versionRepository.findOne({
      where: { id: versionId, product: { id: license.product.id } },
    });

    if (!version) {
      throw new NotFoundException('Version not found');
    }

    license.currentProductVersion = version;
    await this.licenseRepository.save(license);

    return version;
  }

  async getLicenseConfig(user: User, licenseId: number): Promise<any> {
    const license = await this.getLicense(user.discordId, licenseId, ['currentProductVersion']);

    if (!license.currentProductVersion) {
      return license;
    }

    return this.parseJSON(license.config);
  }

  async updateConfig(user: User, licenseId: number, config: string): Promise<License> {
    const license = await this.getLicense(user.discordId, licenseId, ['currentProductVersion']);

    const parsedNewConfig = this.parseJSON(config);
    const parsedCurrentConfig = this.parseJSON(license.currentProductVersion.config);

    if (!this.ajv.validate(parsedCurrentConfig, parsedNewConfig)) {
      throw new ForbiddenException('Invalid configuration');
    }

    const currentLicenseConfig = this.parseJSON(license.config);
    license.config = JSON.stringify({ ...currentLicenseConfig, ...parsedNewConfig as any});

    return this.licenseRepository.save(license);
  }
}

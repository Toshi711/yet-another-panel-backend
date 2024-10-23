import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class OAuth2 {
  @PrimaryColumn()
  discordId: string;

  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;
}

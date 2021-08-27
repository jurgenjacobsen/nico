import { Snowflake } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
  token: process.env.DISCORD_TOKEN,
  voice: {
    vcRole: ['793123005555146782'],
    vcRoleChannels: []
  }
};

export interface Config {
  token: string | undefined,
  voice: {
    vcRole: Snowflake[],
    vcRoleChannels: Snowflake[]
  }
}
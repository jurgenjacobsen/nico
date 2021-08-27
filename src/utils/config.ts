import { Snowflake } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
  token: process.env.DISCORD_TOKEN,
  voice: {
    vcRoles: ['793123005555146782'],
    vcRoleChannels: ['880911883299860511'],
    eventRoles: [],
    eventChannels: [],
  }
};

export interface Config {
  token: string | undefined,
  voice: {
    vcRoles: Snowflake[],
    vcRoleChannels: Snowflake[],
    eventRoles: Snowflake[],
    eventChannels: Snowflake[],
  }
}
import { ColorResolvable, Snowflake } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
  token: process.env.DISCORD_TOKEN,
  suggestionChannels: ['840045583028715541'],
  color: '#2F3136',
  voice: {
    vcRoles: ['793123005555146782'],
    vcRoleChannels: ['880911883299860511'],
    eventRoles: [],
    eventChannels: [],
  },
  text: {
    allowedXPChannels: [],
    DXPRoles: [],
    DXPChannels: [],
  },
  logs: {
    invites: '840045583028715541'
  }
};

export const mongo = {
  uri: process.env.MONGO_URI as string,
  name: process.env.MONGO_DB as string,
  user: process.env.MONGO_USER as string,
  pass: process.env.MONGO_PASS as string,
}

export interface Config {
  token: string | undefined,
  suggestionChannels: Snowflake[],
  color: ColorResolvable,
  voice: {
    vcRoles: Snowflake[],
    vcRoleChannels: Snowflake[],
    eventRoles: Snowflake[],
    eventChannels: Snowflake[],
  },
  text: {
    allowedXPChannels: Snowflake[],
    DXPRoles: Snowflake[],
    DXPChannels: Snowflake[],
  },
  logs: {
    invites: Snowflake,
  }
}
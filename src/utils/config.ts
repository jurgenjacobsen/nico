import { ColorResolvable, Snowflake } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

export const config: Config = {
  token: process.env.DISCORD_TOKEN,
  welcomeChannel: '840045583028715541',
  color: '#2F3136',
  memberCounterChannels: ['727641717188198523', '465945316596645889'],
  memberCounterText: 'Estamos com {{counter}} clikkies!',
  suggestion: {
    perms: [
      '466235743367331862',
      '709450575640789083',
      '466073653692334080',
      '739183741515071539',
    ],
    channelIds: ['1'],
    up: '835948756649377832',
    down: '835948681588244530',
    approve: '678281143396859962',
    minLength: 1,
  },
  voice: {
    vcRoles: ['793123005555146782'],
    vcRoleChannels: ['880911883299860511'],
    eventRoles: [],
    eventChannels: [],
  },
  text: {
    allowedXPChannels: [],
    allowedStatsChannels: [],
    DXPRoles: [],
    DXPChannels: [],
  },
  logs: {
    invites: '840045583028715541',
  },
}

export interface Config {
  token: string | undefined
  welcomeChannel: Snowflake
  color: ColorResolvable
  memberCounterChannels: Snowflake[]
  memberCounterText: string
  suggestion: {
    perms: Snowflake[]
    channelIds: Snowflake[]
    up: Snowflake
    down: Snowflake
    approve: Snowflake
    minLength: number
  }
  voice: {
    vcRoles: Snowflake[]
    vcRoleChannels: Snowflake[]
    eventRoles: Snowflake[]
    eventChannels: Snowflake[]
  }
  text: {
    allowedXPChannels: Snowflake[]
    allowedStatsChannels: Snowflake[]
    DXPRoles: Snowflake[]
    DXPChannels: Snowflake[]
  }
  logs: {
    invites: Snowflake
  }
}

export const mongo = {
  uri: process.env.MONGO_URI as string,
  name: process.env.MONGO_DB as string,
  user: process.env.MONGO_USER as string,
  pass: process.env.MONGO_PASS as string,
}

import { ColorResolvable, Snowflake } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

export const config: Config = {
  token: process.env.DISCORD_TOKEN,
  welcomeChannel: '840045583028715541',
  color: '#2F3136',
  memberCounterChannels: ['727641717188198523', '465945316596645889'],
  memberCounterText: 'Estamos com {{counter}} clikkies!',
  devs: {
    ids: ['292065674338107393'],
  },
  suggestion: {
    perms: ['466235743367331862', '709450575640789083', '466073653692334080', '739183741515071539'],
    channelIds: ['466247771792605186'],
    up: '835948756649377832',
    down: '835948681588244530',
    approve: '678281143396859962',
    minLength: 1,
  },
  voice: {
    vcRoles: ['793123005555146782'],
    vcRoleChannels: ['716822059191107686', '466255757289979905', '724071900652896389', '724425811398230046', '829517101416185896', '872253338534682664', '698251644516958358'],
    eventRoles: ['842597067187683338'],
    eventChannels: ['828323204099080212'],
    allowedXPChannels: [
      '716822059191107686', '466255757289979905', '724071900652896389', '724425811398230046', '829517101416185896', '872253338534682664', 
      '698251644516958358', '677321568791167019', '718493496381669376', '793550736981622844', '832768823777820682'
    ],
    allowedStatsChannels: ['716822059191107686', '466255757289979905', '724071900652896389', '724425811398230046', '829517101416185896', '872253338534682664', '698251644516958358'],
  },
  text: {
    allowedXPChannels: ['850815477064007760', '840045583028715541'],
    allowedStatsChannels: ['739188571667431494', '466068493142458370', '698246223420850227', '821872371295059988', '466244636621537281', '816410847920259113', '466242504824717315', '850815477064007760', '840045583028715541'],
    DXPRoles: [],
    DXPChannels: [],
  },
  economy: {
    resetDate: new Date('11/10/2021'),
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
  devs: {
    ids: Snowflake[]
  }
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
    allowedXPChannels: Snowflake[],
    allowedStatsChannels: Snowflake[],
  }
  text: {
    allowedXPChannels: Snowflake[]
    allowedStatsChannels: Snowflake[]
    DXPRoles: Snowflake[]
    DXPChannels: Snowflake[]
  }
  economy: {
    resetDate: Date
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

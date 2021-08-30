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
    /** Cargos que serão dados ao usuário quando um membro entrar em call */
    vcRoles: [

    ],
    /*** Canais de voz que darão cargos de call ao entrar */
    vcRoleChannels: [

    ],
    /** Cargos que serão adicionados quando o membro entrar em um canal de evento */
    eventRoles: [
      '842597067187683338'
    ],
    /** Canais de evento
     * 
     */
    eventChannels: [
      '828323204099080212'
    ],
    allowedXPChannels: [],
    /** ID dos canais que re */
    allowedStatsChannels: [

    ],
    /** ID dos cargos que receberão o dobro de XP */
    DXPRoles: [
    
    ],
    /** ID dos canais que receberão o dobro de XP */
    DXPChannels: [
      
    ],
  },
  text: {
    /** ID dos canais que é permitido receber XP */
    allowedXPChannels: [

    ],
    /** ID dos canais que é permitido contar estatísticas para o usuário */
    allowedStatsChannels: [
    
    ],
    /** ID das categorias que é permitido contar estatísticas para o usuário */
    allowedStatsCats: [
      
    ],
    /** ID das categorias que é permitido ao usuário receber XP */
    allowedXPCats: [
    
    ],
    /** ID dos cargos que receberão o dobro de XP */
    DXPRoles: [
    
    ],
    /** ID dos canais que receberão o dobro de XP */
    DXPChannels: [
      
    ],
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
    allowedXPChannels: Snowflake[]
    allowedStatsChannels: Snowflake[]
    DXPRoles: Snowflake[]
    DXPChannels: Snowflake[]
  }
  text: {
    allowedXPChannels: Snowflake[]
    allowedStatsChannels: Snowflake[]
    allowedStatsCats: Snowflake[]
    allowedXPCats: Snowflake[]
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

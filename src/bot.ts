import { Client, ClientOptions, Collection, Guild, GuildMember, Intents, Invite, MessageEmbed, Role, Snowflake, TextChannel } from 'discord.js'
import { Commands } from 'dsc.cmds'
import { EventHandler } from 'dsc.events'
import { Config, config, mongo } from './utils/config'
import path from 'path'
import logs from 'discord-logs'
import colors from 'colors'
import { Levels } from 'dsc.levels'
import { Economy } from 'dsc.eco'
import { GuildStats, UserStats } from 'dsc.stats'
import { User } from 'dsc.levels/lib/Levels'
import { print } from './utils/utils'
import { Database } from 'dsc.db'
import { BirthdaysManager } from './utils/birthdays'
import { GiveawaysManager } from 'discord-giveaways'
import { FeedManager } from './utils/topfeed'
import { GraphicsManager } from './utils/graphics'
import InvitesTracker from '@androz2091/discord-invites-tracker'
import moment from 'moment'
export class Bot extends Client {
  public config: Config
  public commands: Commands
  public events: EventHandler
  public levels: Levels
  public eco: Economy
  public birthdays: BirthdaysManager
  public voiceIntervals: Collection<string, NodeJS.Timer | null>
  public graphics: GraphicsManager
  public topfeed: FeedManager
  public giveaways!: GiveawaysManager
  public stats: {
    users: UserStats
    guild: GuildStats
  }
  public db: {
    members: Database
  }
  constructor(options: ClientOptions) {
    super(options)
    this.login(config.token)

    this.config = config

    this.commands = new Commands({
      bot: this,
      dir: path.join(__dirname, './cmds'),
      debug: true,
      devs: this.config.devs.ids,
      msgs: {
        cooldown: 'Você deve esperar um momento antes de usar este comando novamente!',
        guildOnly: 'Comando somente para ser usado dentro do servidor.',
        devOnly: 'Este comando é somente para desenvolvedores.',
        channel: 'Canal não permitido.',
      },
    })

    this.events = new EventHandler({
      bot: this,
      dir: path.join(__dirname, './events'),
    })

    this.levels = new Levels({
      ...mongo,
    })

    this.eco = new Economy({
      db: {
        ...mongo,
        collection: 'economy',
      },
      items: [],
    })

    this.voiceIntervals = new Collection()

    this.topfeed = new FeedManager({
      db: new Database({ ...mongo, collection: 'topfeed' }),
      accounts: [
        // Coming soon
      ],
    })

    try {
      this.giveaways = new GiveawaysManager(this, {
        default: {
          botsCanWin: false,
          embedColor: this.config.color,
          embedColorEnd: '#5865F2',
          reaction: '🎉',
        },
        storage: path.join(__dirname, './utils/giveaways.json'),
      })
    } catch {
      print('Erro ao carregar os sorteios')
    }

    this.stats = {
      users: new UserStats({ db: mongo, dateFormat: 'DD/MM/YYYY' }),
      guild: new GuildStats({ db: mongo, dateFormat: 'DD/MM/YYYY' }),
    }

    this.graphics = new GraphicsManager(this.stats.users)

    this.db = {
      members: new Database({ ...mongo, collection: 'members' }),
    }

    this.birthdays = new BirthdaysManager(this.db.members)

    logs(this)
  }
}

export const bot = new Bot({
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_WEBHOOKS,
  ],
  presence: {
    activities: [
      {
        name: 'Dema City',
        type: 'WATCHING',
      },
    ],
  },
})

let tracker = InvitesTracker.init(bot, {
  fetchGuilds: true,
  fetchVanity: true,
  fetchAuditLogs: true,
})

tracker.on('guildMemberAdd', (member, type, invite) => {
  let logs = bot.channels.cache.get(bot.config.logs.tracker) as TextChannel
  if (!logs) return

  let embed = new MessageEmbed().setColor(bot.config.color).setAuthor(member.user.username, member.user.displayAvatarURL({ dynamic: true, size: 256 }))

  if (type === 'normal' && invite) {
    embed.setDescription(`
    Este membro entrou através do convite ${invite?.url}!

    Criado por: ${member.toString()}
    Criado em: ${moment(invite.createdAt).format('DD/MM/YYYY [às] hh:mm:ss')}
    Usos: ${invite.uses ?? 1}
    `)
  } else if (type === 'permissions' || type === 'unknown') {
    embed.setDescription(`Não foi possível identificar através de qual convite este membro entrou.`)
  } else if (type === 'vanity') {
    embed.setDescription(`Entrou através de https://discord.gg/${member.guild.vanityURLCode}`)
  }

  return logs.send({
    embeds: [embed],
  })
})

bot.levels.on('textLevelUp', (user: User) => {
  let guild = bot.guilds.cache.get(bot.config.guild) as Guild
  let member = guild.members.cache.get(user.userID) as GuildMember

  /*
  let role = guild.roles.cache.find((r) => r.name.includes(`nível ${user.textLevel}`));
  if(role) {
    member.roles.add(role);
  }; 
  */

  print(`${colors.gray('[TEXTO]')} ${member.user.tag} subiu para o nível ${user.textLevel}!`)
})

bot.levels.on('voiceLevelUp', (user: User) => {
  let guild = bot.guilds.cache.get(bot.config.guild) as Guild
  let member = guild.members.cache.get(user.userID) as GuildMember

  let roles: { [key: string]: Snowflake } = {
    10: '861635332436918345',
    20: '861635578859749437',
    30: '795706003412746260',
    40: '795703589300994058',
    50: '861637124021026857',
  }

  /*
  let role: Snowflake | undefined = roles[user.voiceLevel];
  if(role) {
    member.roles.add(role);
  }*/

  print(`${colors.gray('[VOZ]')} ${member.user.tag} subiu para o nível ${user.voiceLevel}!`)
})

bot.birthdays.on('BDAY', (user) => {
  /*
  let guild = bot.guilds.cache.get(bot.config.guild) as Guild;
  let member = guild.members.cache.get(user.id) as GuildMember;
  let bdayRole = guild.roles.cache.find((r) => r.name.includes(`Aniversariante do dia`));

  if(bdayRole) {
    member.roles.add(bdayRole);
  }
  */
})

bot.birthdays.on('NON-BDAY', (user) => {
  /*
  let guild = bot.guilds.cache.get(bot.config.guild) as Guild;
  let member = guild.members.cache.get(user.id) as GuildMember;
  let bdayRole = guild.roles.cache.find((r) => r.name.includes(`Aniversariante do dia`));

  if(bdayRole) {
    if(member.roles.cache.has(bdayRole.id)) {
      member.roles.remove(bdayRole.id);
    }
  }
  */
})

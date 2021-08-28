import { Client, ClientOptions, Intents } from 'discord.js'
import { Commands } from 'dsc.cmds'
import { EventHandler } from 'dsc.events'
import { Config, config, mongo } from './utils/config'
import path from 'path'
import logs from 'discord-logs'
import { Levels } from 'dsc.levels'
import { Economy, Item } from 'dsc.eco'
import { UserStats } from 'dsc.stats'

export class Bot extends Client {
  public config: Config;
  public commands: Commands;
  public events: EventHandler;
  public levels: Levels;
  public eco: Economy;
  public stats: {
    users: UserStats;
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
      items: [new Item({ id: '1', name: '2', price: 100 }), new Item({ id: '2', name: 'Bah', price: 21323 })],
    });

    this.stats = {
      users: new UserStats({db: mongo, dateFormat: 'DD/MM/YYYY'})
    }

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
  ws: {
    properties: {
      $browser: 'Discord iOS',
    },
  },
});
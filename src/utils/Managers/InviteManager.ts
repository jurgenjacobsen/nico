import { Guild, Collection, Invite } from 'discord.js';
import { Bot } from '../../bot';

const wait = require('util').promisify(setTimeout);

export class InvitesManager {
  public options: InvitesManagerOptions;
  public cache: InvitesCache;
  private bot: Bot;
  constructor(bot: Bot) {
    this.bot = bot;
    this.cache = new Collection();

    this.options = {};

    this.__update__(true);
  }

  public async __update__(first?: boolean) {
    if (first) await wait(5000);

    let guild = this.bot.guilds.cache.get(this.bot.config.guild) as Guild;
    let invites = await guild.invites.fetch();

    invites.forEach((i) => {
      this.cache.set(i.code, i);
    });
  }

  public check(): Promise<Invite | null> {
    return new Promise(async (resolve) => {
      let guild = this.bot.guilds.cache.get(this.bot.config.guild) as Guild;
      let invites = await guild.invites.fetch();

      let invite: Invite | null = null;

      invites.forEach((now) => {
        let before = this.cache.get(now.code);
        if (before?.uses && now.uses && now.uses > before.uses) {
          invite = now;
        }
      });
      
      this.__update__();
      return resolve(invite);
    });
  }
}

export interface InvitesManagerOptions {}

export type InvitesCache = Collection<string, Invite>;

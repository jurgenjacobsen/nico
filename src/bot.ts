import { Client, ClientOptions, Intents } from "discord.js";
import { Commands } from "dsc.cmds";
import { EventHandler } from "dsc.events";
import { Config, config } from "./utils/config";
import path from "path";
import logs from 'discord-logs';

export class Bot extends Client {
  public config: Config;
  public commands: Commands;
  public events: EventHandler;
  constructor(options: ClientOptions) {
    super(options);
    this.login(config.token);
    
    this.config = config;
    
    this.commands = new Commands({
      bot: this,
      dir: path.join(__dirname, './cmds'),
      debug: true,
    });

    this.events = new EventHandler({
      bot: this,
      dir: path.join(__dirname, './events'),
    });
    
    logs(this);
  }
};

export const bot = new Bot({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_VOICE_STATES],
});
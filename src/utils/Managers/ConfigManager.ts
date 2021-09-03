import { Snowflake } from 'discord.js';
import { Database } from 'dsc.db';
import { Bot } from '../../bot';

export class ConfigManager {
  private db: Database;
  private id: string;
  private bot: Bot;
  constructor(db: Database, id: Snowflake | string, bot: Bot) {
    this.db = db;
    this.id = id;
    this.bot = bot;

    this.update();
  }

  public async update() {
    let raw = await this.db.fetch(this.id);
    if (!raw) return;

    let data = raw.data;

    Object.keys(data).forEach((key, i) => {
      let localKey = (this.bot.config as any)[key];
      if (localKey) {
        if (Array.isArray(localKey)) {
          (this.bot.config as any)[key] = [];
          for (let value of data[key]) {
            (this.bot.config as any)[key].push(value);
          }
        }
      }
    });
  }
}

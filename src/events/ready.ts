import { EventOptions } from 'dsc.events'
import { print } from '../utils/utils'
import { Bot } from '../bot'
import { Guild } from 'discord.js';

export const event: EventOptions = {
  name: 'ready',
  once: true,
  run: async (bot: Bot) => {
    print('Pronto! 😋');

    setInterval(async () => {
      let guild = bot.guilds.cache.get('465938334791893002');
      if(!guild) return;
      let todayStats = await bot.stats.guild.fetch('465938334791893002', 1);
      if(!todayStats) return;
      if((todayStats[0].totalMembers ?? 0) < (guild).memberCount) {
        bot.stats.guild.update('465938334791893002', 'totalMembers', guild.memberCount).then(console.log);
      }
    }, 30 * 60 * 1000);
  },
}

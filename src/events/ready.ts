import { EventOptions } from 'dsc.events';
import { print } from '../Utils/utils';
import { Bot } from '../bot';

export const event: EventOptions = {
  name: 'ready',
  once: true,
  run: async (bot: Bot) => {
    print('Pronto! 😋');

    setInterval(async () => {
      let guild = bot.guilds.cache.get('465938334791893002');
      if (!guild) return;
      let todayStats = await bot.stats.guild.fetch('465938334791893002', 1);
      if (!todayStats) return;
      if ((todayStats[0].totalMembers ?? 0) < guild.memberCount) {
        bot.stats.guild.update('465938334791893002', 'totalMembers', guild.memberCount);
      }
    }, 30 * 60 * 1000);

    let bot_config = await bot.db.this.fetch(`${bot.user?.id}`).then((data) => data?.data);

    bot.user?.setPresence({
      status: bot_config.statusType,
      activities: [
        {
          name: typeof bot_config.playingStatus === 'string' ? bot_config.playingStatus : 'dema.city'
        }
      ]
    });

  },
};

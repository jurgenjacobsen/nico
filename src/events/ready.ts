import { EventOptions } from 'dsc.events'
import { print } from '../utils/utils'
import { Bot } from '../bot'
import { Util } from 'dsc.levels';

export const event: EventOptions = {
  name: 'ready',
  once: true,
  run: async (bot: Bot) => {
    print('Pronto! 😋');

    setInterval(() => {
      let voiceStates = bot.guilds.cache.get('465938334791893002')?.voiceStates.cache;
      if(!voiceStates) return;

      voiceStates?.forEach((vs, id) => {
        if(!vs.channelId) return;
        if(bot.config.voice.allowedStatsChannels.includes(vs.channelId)) {
          bot.stats.users.update(vs.id, 'voice', 2);
        };
        if(bot.config.voice.allowedXPChannels.includes(vs.channelId)) {
          bot.levels.update(vs.id, 'VOICE', Math.floor(Util.random(2, 7)));
        };
      });
    }, 2 * 60 * 1000);
  },
}

import { GuildMember, VoiceChannel } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';
import { VoiceRoles } from '../utils/utils';

export const event: EventOptions = {
  name: 'voiceChannelLeave',
  once: false,
  run: (bot: Bot, member: GuildMember, channel: VoiceChannel) => {
    VoiceRoles(bot, member, { id: '1', parentId: '1' });

    let counter = bot.voiceIntervals.get(member.id);
    if (counter) {
      clearInterval(counter);
    }
    bot.voiceIntervals.delete(member.id);
  },
};

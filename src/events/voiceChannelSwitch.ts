import { GuildMember, VoiceChannel } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';
import { print, VoiceCounters, VoiceRoles } from '../Utils/utils';

export const event: EventOptions = {
  name: 'voiceChannelSwitch',
  once: false,
  run: (bot: Bot, member: GuildMember, oldChannel: VoiceChannel, newChannel: VoiceChannel) => {
    VoiceRoles(bot, member, newChannel);

    VoiceCounters(bot, member, newChannel);
  },
};

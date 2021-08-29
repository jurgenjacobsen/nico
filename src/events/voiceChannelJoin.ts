import { GuildMember, VoiceChannel } from 'discord.js'
import { EventOptions } from 'dsc.events'
import { Bot } from '../bot'
import { print, VoiceCounters, VoiceRoles } from '../utils/utils'

export const event: EventOptions = {
  name: 'voiceChannelJoin',
  once: false,
  run: (bot: Bot, member: GuildMember, channel: VoiceChannel) => {
    
    VoiceRoles(bot, member, channel);

    VoiceCounters(bot, member, channel);
  },
}

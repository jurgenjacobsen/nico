import { GuildMember, VoiceChannel } from 'discord.js'
import { EventOptions } from 'dsc.events'
import { Bot } from '../bot'
import { print, VoiceRoles } from '../utils/utils'

export const event: EventOptions = {
  name: 'voiceChannelSwitch',
  once: false,
  run: (bot: Bot, member: GuildMember, oldChannel: VoiceChannel, newChannel: VoiceChannel) => {
    
    VoiceRoles(bot, member, newChannel);

  },
}

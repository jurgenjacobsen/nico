import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";

export const event: EventOptions = {
  name: 'voiceChannelSwitch',
  once: false,
  run: (bot: Bot, member: GuildMember, oldChannel: VoiceChannel, newChannel: VoiceChannel) => {

    if(bot.config.voice.vcRoleChannels.includes(newChannel.id)) {
      member.roles.add(bot.config.voice.vcRole);
    } else {
      member.roles.remove(bot.config.voice.vcRole);
    };
    
  }
}
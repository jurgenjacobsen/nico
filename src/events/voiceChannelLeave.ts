import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";

export const event: EventOptions = {
  name: 'voiceChannelLeave',
  once: false,
  run: (bot: Bot, member: GuildMember, channel: VoiceChannel) => {
    
    member.roles.remove(bot.config.voice.vcRole);

  }
}
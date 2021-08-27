import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";

export const event: EventOptions = {
  name: 'voiceChannelJoin',
  once: false,
  run: (bot: Bot, member: GuildMember, channel: VoiceChannel) => {

    if(bot.config.voice.vcRoleChannels.includes(channel.id)) {
      member.roles.add(bot.config.voice.vcRole);
    }

  }
}
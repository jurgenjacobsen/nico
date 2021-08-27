import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { print } from "../utils";

export const event: EventOptions = {
  name: 'voiceChannelJoin',
  once: false,
  run: (bot: Bot, member: GuildMember, channel: VoiceChannel) => {

    if(bot.config.voice.vcRoleChannels.includes(channel.id)) {
      member.roles.add(bot.config.voice.vcRole)
      .then(() => print(`Cargos de canal de voz adicionado a ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao adicionar cargos de canal de voz em ${member.user.tag}`));
    }

  }
}
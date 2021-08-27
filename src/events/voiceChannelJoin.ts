import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { print } from "../utils/utils";

export const event: EventOptions = {
  name: 'voiceChannelJoin',
  once: false,
  run: (bot: Bot, member: GuildMember, channel: VoiceChannel) => {

    if(bot.config.voice.vcRoleChannels.includes(channel.id)) {
      member.roles.add(bot.config.voice.vcRoles)
      .then(() => print(`Cargos de canal de voz adicionado a ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao adicionar cargos de canal de voz de ${member.user.tag}`));
    }

    if(bot.config.voice.eventChannels.includes(channel.id)) {
      member.roles.add(bot.config.voice.eventRoles)
      .then(() => print(`Cargos de evento foram adicionados à ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao adicionar cargos de evento de ${member.user.tag}`));
    }

  }
}
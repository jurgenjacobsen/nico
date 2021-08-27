import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { print } from "../utils/utils";

export const event: EventOptions = {
  name: 'voiceChannelSwitch',
  once: false,
  run: (bot: Bot, member: GuildMember, oldChannel: VoiceChannel, newChannel: VoiceChannel) => {

    if(bot.config.voice.vcRoleChannels.includes(newChannel.id)) {
      member.roles.add(bot.config.voice.vcRoles)
      .then(() => print(`Cargo(s) de canal de voz adicionado a ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao adicionar cargos de canal de voz em ${member.user.tag}`));
    } else {
      member.roles.remove(bot.config.voice.vcRoles)
      .then(() => print(`Cargo(s) de canal de voz removido de ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao remover cargos de canal de voz de ${member.user.tag}`));
    };

    if(bot.config.voice.eventChannels.includes(newChannel.id)) {
      member.roles.add(bot.config.voice.eventRoles)
      .then(() => print(`Cargos de evento foram adicionados à ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao adicionar cargos de evento de ${member.user.tag}`));
    } else {
      member.roles.remove(bot.config.voice.eventRoles)
      .then(() => print(`Cargos de evento foram removidos de ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao remover cargos de evento de ${member.user.tag}`));;
    }
    
  }
}
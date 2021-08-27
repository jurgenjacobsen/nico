import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { print } from "../utils";

export const event: EventOptions = {
  name: 'voiceChannelSwitch',
  once: false,
  run: (bot: Bot, member: GuildMember, oldChannel: VoiceChannel, newChannel: VoiceChannel) => {

    if(bot.config.voice.vcRoleChannels.includes(newChannel.id)) {
      member.roles.add(bot.config.voice.vcRole)
      .then(() => print(`Cargo(s) de canal de voz adicionado a ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao adicionar cargos de canal de voz em ${member.user.tag}`));
    } else {
      member.roles.remove(bot.config.voice.vcRole)
      .then(() => print(`Cargo(s) de canal de voz removido de ${member.user.tag}`))
      .catch(() => print(`Houve um erro ao remover cargos de canal de voz de ${member.user.tag}`));
    };
    
  }
}
import { GuildMember, VoiceChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { print } from "../utils/utils";

export const event: EventOptions = {
  name: 'voiceChannelLeave',
  once: false,
  run: (bot: Bot, member: GuildMember, channel: VoiceChannel) => {
    
    member.roles.remove(bot.config.voice.vcRoles)
    .then(() => print(`Cargos de canal de voz removido de ${member.user.tag}`))
    .catch(() => print(`Houve um erro ao remover cargos de canal de voz de ${member.user.tag}`));

    member.roles.remove(bot.config.voice.eventRoles)
    .then(() => print(`Cargos de evento foram removidos de ${member.user.tag}`))
    .catch(() => print(`Houve um erro ao remover cargos de evento de ${member.user.tag}`));
  }
}
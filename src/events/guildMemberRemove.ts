import { GuildMember } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { MemberCounter, print } from "../utils/utils";

export const event: EventOptions = {
  name: 'guildMemberRemove',
  once: false,
  run: (bot: Bot, member: GuildMember) => {

    MemberCounter(bot, member.guild);

    print(`Membro ${member.user.tag} acabou de sair.`);
  }
}
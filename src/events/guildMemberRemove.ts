import { GuildMember } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';
import { MemberCounter, print } from '../Utils/utils';

export const event: EventOptions = {
  name: 'guildMemberRemove',
  once: false,
  run: (bot: Bot, member: GuildMember) => {
    MemberCounter(bot, member.guild);

    bot.stats.guild.update(member.guild.id, 'leftMembers', 1);

    print(`Membro ${member.user.tag} acabou de sair.`);
  },
};

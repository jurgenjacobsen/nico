import { GuildMember, Role } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';
import { print } from '../utils/utils';

export const event: EventOptions = {
  name: 'guildMemberRoleAdd',
  once: false,
  run: (bot: Bot, member: GuildMember, role: Role) => {
    let guild = member.guild;
    let roles = guild.roles.cache;

    let levelcat = roles.get('725481030966050828') as Role;
    let topfeedcat = roles.get('741819097171361823') as Role;
    let registercat = roles.get('744359067363049533') as Role;
    let rolescat = roles.get('730452396504907876') as Role;

    if (registercat.position > role.position && topfeedcat.position < role.position && member.roles.cache.has(registercat.id)) {
      // Registro
      member.roles.add(registercat);

      print(`Categoria ${registercat.name.replace(/ /g, '')} adicionada em ${member.user.tag}!`);
    }

    if (topfeedcat.position > role.position && levelcat.position < role.position && member.roles.cache.has(topfeedcat.id)) {
      // Top feed
      member.roles.add(topfeedcat);

      print(`Categoria ${topfeedcat.name.replace(/ /g, '')} adicionada em ${member.user.tag}!`);
    }

    if (levelcat.position > role.position && rolescat.position < role.position && member.roles.cache.has(levelcat.id)) {
      // Nivel
      member.roles.add(levelcat);

      print(`Categoria ${levelcat.name.replace(/ /g, '')} adicionada em ${member.user.tag}!`);
    }

    if (rolescat.position > role.position && member.roles.cache.has(rolescat.id)) {
      // Roles
      member.roles.add(rolescat);

      print(`Categoria ${rolescat.name.replace(/ /g, '')} adicionada em ${member.user.tag}!`);
    }
  },
};

import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import moment from 'moment';
import { Bot } from '../bot';
import { badges } from '../utils/Structures/badges';

export const cmd: CommandOptions = {
  name: 'badges',
  guildOnly: true,
  run: (bot: Bot, interaction: CommandInteraction) => {
    let embed = new MessageEmbed().setColor(bot.config.color).setDescription(`
    **Badges**
    São ícones que serão mostrados no seu perfil simbolizando lembranças ou conquistas dentro do servidor.

    ${badges.LIST.map((b) => {
      return `${b.emoji} - **${b.name}** - *${moment(b.date).format('DD/MM/YYYY')}*\n${b.description}\n`;
    }).join('\n')}
    `);

    return interaction
      .reply({
        embeds: [embed],
      })
      .catch(() => {});
  },
};

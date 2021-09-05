import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import moment from 'moment';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'badges',
  guildOnly: true,
  run: (bot: Bot, interaction: CommandInteraction) => {
    let member = interaction.guild?.members.cache.get(interaction.user.id) as GuildMember;

    let embed = new MessageEmbed().setColor(bot.config.color).setDescription(`
    **Badges**
    São ícones que serão mostrados no seu perfil simbolizando lembranças ou conquistas dentro do servidor.

    ${bot.badges.LIST.map((b) => {
      return `${b.emoji} - **${b.name}** - *${moment(b.date).format('DD/MM/YYYY')}*\n${b.description}\n`;
    }).join('\n')}
    `);

    let row = new MessageActionRow().addComponents([
      new MessageButton().setLabel('Coletar badges disponíveis').setStyle('SUCCESS').setCustomId('COLLECT_AVALIABLE_BADGES'),
    ]);

    interaction
      .reply({
        embeds: [embed],
        components: [row],
      })
      .catch(() => {});

    let collector = interaction.channel?.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id, time: 10 * 60 * 1000 });

    collector?.on('collect', async (i) => {
      switch (i.customId) {
        case 'COLLECT_AVALIABLE_BADGES':
          {
            i.deferUpdate().catch((err) => {});

            if (member.roles.cache.has('850107657238740993')) {
              await bot.badges.give(interaction.user.id, '2');
            }

            if (new Date().getTime() - (member.joinedAt as Date).getTime() >= 15778800000) {
              await bot.badges.give(interaction.user.id, '5');
            }

            if (new Date().getTime() - (member.joinedAt as Date).getTime() >= 31557600000) {
              await bot.badges.give(interaction.user.id, '6');
            }

            if (new Date().getTime() - (member.joinedAt as Date).getTime() >= 63115200000) {
              await bot.badges.give(interaction.user.id, '7');
            }
          }
          break;
      }
    });

    return;
  },
};

import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'daily',
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let user = await bot.eco.ensure(interaction.user.id, interaction.guild?.id);
    let response = await bot.eco.daily(interaction.user.id, interaction.guild?.id, {
      timeout: 20 * 60 * 60 * 1000,
      money: {
        max: 400,
        min: 150,
      },
    });

    if (response?.err) {
      switch (response.err) {
        case 'COOLDOWN':
          {
            let remaining = '';

            if (response.remaining) {
              if (response.remaining.hours > 0) {
                remaining = ` ${response.remaining.hours}h ${response.remaining.minutes}m `;
              } else if (response.remaining.minutes > 0) {
                remaining = ` ${response.remaining.minutes}m ${response.remaining.seconds}s `;
              } else if (response.remaining.seconds > 1) {
                remaining = ` ${response.remaining.seconds}s `;
              } else {
                remaining = ` um segundo `;
              }
            }

            let embed = new MessageEmbed().setColor(bot.config.color).setDescription(`Você deve esperar${remaining}para coletar o \`daily\` novamente!`);

            return interaction.reply({
              embeds: [embed],
            });
          }
          break;
        default: {
          return interaction.reply({
            content: `Houve um erro ao coletar o \`/daily\`.`,
          });
        }
      }
    }

    if (!response) {
      return interaction.reply({
        content: `Houve um erro ao coletar o \`/daily\`.`,
      });
    }

    if (!user) {
      user = await bot.eco.ensure(interaction.user.id, interaction.guild?.id);
    }

    let embed = new MessageEmbed()
      .setColor(bot.config.color)
      .setDescription(
        `Você recebeu **$${
          user.wallet > response.user.wallet ? user.wallet - response.user.wallet : response.user.wallet - user.wallet
        }** por coletar sua diária de Dema!`,
      )
      .setFooter(`Você têm um total de $${response.user.bank + response.user.wallet}!`);

    return interaction.reply({
      embeds: [embed],
    });
  },
};

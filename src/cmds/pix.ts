import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'pix',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    if (!interaction.guild) return;

    let to = interaction.options.getUser('membro', true);
    let amount = interaction.options.getNumber('quantia', true);
    let user = await bot.eco.ensure(interaction.user.id, interaction.guild.id);

    amount = Number(amount);

    if (!(amount >= 1 && amount <= 2000)) {
      return interaction.reply({
        content: `Você só pode transferir entre $1 e $2000.`,
      });
    }

    if (user.wallet < amount) {
      return interaction.reply({
        content: `Você não tem esta quantia em sua carteira.`,
      });
    }

    await bot.eco.ensure(to.id, interaction.guild.id);

    let transfer = await bot.eco.transfer(amount, interaction.user.id, to.id, interaction.guild.id);
    if (!transfer) {
      return interaction.reply({
        content: `Houve um erro ao transferir o dinheiro.`,
      });
    }

    interaction
      .reply({
        embeds: [
          new MessageEmbed().setColor(bot.config.color).setDescription(`
        💳 | ${interaction.user.toString()} transferiu **$${amount}** para ${to.toString()}
        `),
        ],
      })
      .catch(() => {});
  },
};

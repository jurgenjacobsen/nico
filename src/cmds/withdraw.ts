import { CommandInteraction, MessageEmbed } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'

export const cmd: CommandOptions = {
  name: 'withdraw',
  devOnly: true,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let amount = interaction.options.getNumber('quantia', true)
    let user = await bot.eco.ensure(interaction.user.id, interaction.guild?.id)

    if (user.bank < amount) {
      return interaction.reply({
        content: `Você não tem dinheiro suficiente para tirar do banco.`,
      })
    }

    if (amount < 1) {
      return interaction.reply({
        content: `Você só pode retirar valores acima de **$1**`,
      })
    }

    let res = await bot.eco.withdraw(amount, interaction.user.id, interaction.guild?.id)

    if (!res) {
      return interaction.reply({
        content: `Houve um erro ao retirar seu dinheiro do banco.`,
      })
    }

    return interaction.reply({
      embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`💳 | **$${amount}** foi retirada para sua carteira!`)],
    })
  },
}

import { CommandInteraction, MessageEmbed } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { User } from 'dsc.eco'
import { Bot } from '../bot'

export const cmd: CommandOptions = {
  name: 'deposit',
  devOnly: true,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let user = await bot.eco.ensure(interaction.user.id, interaction.guild?.id)
    let amount = interaction.options.getNumber('quantia', false)
    amount = amount !== null ? amount : user.wallet

    if (user.wallet >= amount) {
      user = (await bot.eco.deposit(amount, interaction.user.id, interaction.guild?.id)) as User
      return interaction.reply({
        embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`💳 | **$${amount}** foi depositado em seu banco!`)],
      })
    } else {
      return interaction.reply({
        content: `Você não possue dinheiro suficiente na carteira.`,
      })
    }
  },
}

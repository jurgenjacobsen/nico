import { CommandInteraction, MessageEmbed } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'
import { epoch } from '../utils/utils'

export const cmd: CommandOptions = {
  name: 'economy',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let users = await bot.eco.list(interaction.guild?.id)
    let items = bot.eco.store.items.sort((a, b) => b.price - a.price)
    let e1 = new MessageEmbed().setColor(bot.config.color).setDescription(`
    **Economia**\n
    Usuários: ${users?.length}
    Valor total: $${(users?.length as number) > 0 ? users?.map((u) => u.bank + u.wallet).reduce((pv, cv) => pv + cv) : 0}
    Reseta: <t:${epoch(bot.config.economy.resetDate)}:R>

    **Itens disponíveis (${items.length})**: ${
      items.length > 12 ? items.map((i) => i.name).join(', ') : `\n` + items.map((i) => `> ${i.name} - $${i.price}`).join('\n')
    }
    `)

    interaction.reply({
      embeds: [e1],
    })
  },
}

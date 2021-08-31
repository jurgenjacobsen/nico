import { CommandInteraction, MessageEmbed } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'
import { epoch } from '../utils/utils'

export const cmd: CommandOptions = {
  name: 'nico',
  devOnly: false,
  guildOnly: false,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let uptime = bot.eco.ms(new Date().getTime() - (bot.readyAt as Date).getTime())
    let epochCreatedAt = epoch(bot.user?.createdAt as Date)

    let embed = new MessageEmbed().setColor(bot.config.color).setFooter('Criado por Jürgen#0001 💻').setDescription(`
    Informações sobre mim\n
    **Criado**: <t:${epochCreatedAt}:R>
    **Uptime**: ${uptime.days}d ${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s
    **Modo**: ${process.env.IS_PROD ? 'Produção' : 'Desenvolvimento'}
    **Comandos**: ${bot.commands.cache.filter((c) => !c.devOnly).size}/${bot.commands.cache.size}
    \n**Bugs**: **[Github](https://github.com/jurgenjacobsen/nico/issues)**
    `)

    interaction.reply({
      embeds: [embed],
    })
  },
}

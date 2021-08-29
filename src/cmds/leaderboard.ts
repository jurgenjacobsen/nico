import { CommandInteraction, MessageEmbed } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'

export const cmd: CommandOptions = {
  name: 'leaderboard',
  devOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let type = interaction.options.getString('tipo', true) as 'ECONOMY' | 'VOICE_LEVEL' | 'TEXT_LEVEL'
    let embed = new MessageEmbed().setColor(bot.config.color)
    switch (type) {
      case 'ECONOMY':
        {
          let data = await bot.eco.leaderboard({ guildID: interaction.guild?.id, limit: 10 })
          if (!data) return interaction.reply({ content: `Não foi possível encontrar dados para o leaderboard.` })
          let content = ``
          for (let set of data) {
            content += `\n${set.userID === interaction.user.id ? `**#${set.pos}**` : `#${set.pos}`} - <@${set.userID}> - $${set.bank}`
          }
          embed.setDescription(content)
          embed.setFooter(`Economia`)
        }
        break
      case 'TEXT_LEVEL':
        {
          let data = await bot.levels.leaderboard({ type: 'TEXT', guildID: interaction.guild?.id })
          if (!data) return interaction.reply({ content: `Não foi possível encontrar dados para o leaderboard.` })
          let content = ``
          for (let set of data) {
            content += `\n${set.userID === interaction.user.id ? `**#${set.pos}**` : `#${set.pos}`} - <@${set.userID}> - \`${set.textXp}\``
          }
          embed.setDescription(content)
          embed.setFooter(`Níveis de texto`)
        }
        break
      case 'VOICE_LEVEL':
        {
          let data = await bot.levels.leaderboard({ type: 'VOICE', guildID: interaction.guild?.id })
          if (!data) return interaction.reply({ content: `Não foi possível encontrar dados para o leaderboard.` })
          let content = ``
          for (let set of data) {
            console.log(set)
            content += `\n${set.userID === interaction.user.id ? `**#${set.pos}**` : `#${set.pos}`} - <@${set.userID}> - \`${set.voiceXp}\``
          }
          embed.setDescription(content)
          embed.setFooter(`Níveis de voz`)
        }
        break
    }
    return interaction.reply({
      embeds: [embed],
    })
  },
}

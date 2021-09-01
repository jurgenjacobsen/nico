import { CommandInteraction, MessageAttachment } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'
import { Rank } from 'canvacord'

export const cmd: CommandOptions = {
  name: 'card',
  guildOnly: true,
  devOnly: false,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let tipo = interaction.options.getString('tipo', true) as 'TEXT' | 'VOICE'
    let user = interaction.options.getUser('membro', false) ?? interaction.user

    let data = await bot.levels.fetch(user.id, interaction.guild?.id)
    let leaderboard = await bot.levels.leaderboard({ type: tipo, guildID: interaction.guild?.id })

    if (!data) return

    let card = new Rank()
      .setAvatar(user.displayAvatarURL({ dynamic: false, size: 256, format: 'png' }))
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
      .renderEmojis(true)
      .setRank(leaderboard.find((l) => l.userID === user.id)?.pos ?? 0, 'Rank')
      .setBackground('IMAGE', 'https://i.imgur.com/0zdgXGO.png')
      .setOverlay('#1c1c1c', 0.6)
      .setCustomStatusColor('#1c1c1c')
      .setLevelColor('#FFFFFF', '#6e6e6e')
      .setRankColor('#FFFFFF', '#6e6e6e')

    switch (tipo) {
      case 'TEXT':
        {
          card.setCurrentXP(data.textXp)
          card.setRequiredXP(bot.levels.getTotalXPToLevelUp(data.textLevel, data.textXp))
          card.setLevel(data.textLevel, 'Nível')
        }
        break
      case 'VOICE':
        {
          card.setCurrentXP(data.voiceXp)
          card.setRequiredXP(bot.levels.getTotalXPToLevelUp(data.voiceLevel, data.voiceXp))
          card.setLevel(data.voiceLevel, 'Nível')
        }
        break
    }

    let buffer = await (card as any).build()
    let file = new MessageAttachment(buffer, 'card.png')

    return interaction.reply({
      files: [file],
    })
  },
}

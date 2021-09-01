import { CommandInteraction, ContextMenuInteraction, MessageEmbed, Snowflake, WebhookClient } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'

let mentionReg = /<M (\d+)>$/

export const cmd: CommandOptions = {
  name: 'Notas',
  context: true,
  run: async (bot: Bot, i: CommandInteraction) => {
    let interaction: ContextMenuInteraction = i as any

    let message = await interaction.channel?.messages.fetch(interaction.targetId)

    if (!message) {
      return interaction.reply({
        ephemeral: true,
        content: 'Houve um erro!',
      })
    }

    let content = message.content
    let mention

    if (mentionReg.test(content)) {
      let matches = content.match(mentionReg)
      if (matches) {
        let role = message.guild?.roles.cache.get(matches[1] as Snowflake)
        let user = message.guild?.members.cache.get(matches[1] as Snowflake)

        mention = role ? role.toString() : user ? user.toString() : null
      }

      content = content.replace(mentionReg, '')
    }

    let embed = new MessageEmbed().setColor(bot.config.color).setDescription(content)

    let attachment = message.attachments.first()
    if (attachment) {
      embed.setImage(attachment.url)
    }

    let webhook = new WebhookClient({ url: process.env.NOTES_WEBHOOK_URL as string })

    let payload: any = {
      embeds: [embed],
    }

    if (mention) payload.content = mention

    webhook.send(payload)

    return interaction.reply({
      ephemeral: true,
      content: `Essa mensagem foi públicada com sucesso!`,
    })
  },
}

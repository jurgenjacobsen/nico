import { CommandInteraction, MessageEmbed } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'

let imgur_re = /^(https?:)?\/\/(\w+\.)?imgur\.com\/(\S*)(\.[a-zA-Z]{3})$/
let hex_re = /^#(?:[0-9a-fA-F]{3}){1,2}$/

export const cmd: CommandOptions = {
  name: 'customize',
  devOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let subcmd = interaction.options.getSubcommand() as 'profile'
    let key = interaction.options.getString('key', true)
    let data = interaction.options.getString('data', true)

    let user = await bot.db.members.fetch(interaction.user.id)
    if (!user)
      return interaction.reply({
        content: `Você ainda não tem um perfil, crie um usando \`/profile create\``,
      })
    let eco = await bot.eco.fetch(interaction.user.id, interaction.guild?.id)
    if (!eco)
      return interaction.reply({
        content: `Não foi encontrado nenhum dado seu na economia.`,
      })

    let inventory = eco.inventory as unknown[] as string[]

    switch (subcmd) {
      case 'profile':
        {
          let nescessaryItems: { [key: string]: string } = {
            bannerURL: '883038166733451354',
            color: '883038238275682344',
          }

          let item = nescessaryItems[key]

          if (!inventory.includes(item))
            return interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(bot.config.color)
                  .setDescription(`Você deve comprar o item ${bot.eco.store.items.find((i) => i.id === item)?.name} para esta ação.`),
              ],
            })

          if (key === 'bannerURL') {
            if (!imgur_re.test(data))
              return interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(bot.config.color)
                    .setDescription(`A URL de banner deve seguir o formato padrão do Imgur.com! Ex.: https://i.imgur.com/PMUrGYU.png`),
                ],
              })
          } else if (key === 'color') {
            if (!hex_re.test(data))
              return interaction.reply({
                embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`A cor de perfil deve seguir o formato HEX Code! Ex.: #1c1c1c`)],
              })
          }

          await bot.db.members.set(`${interaction.user.id}.${key}`, data)

          interaction.reply({
            embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`Alteração efetuada com sucesso!`)],
          })
        }
        break
    }
  },
}

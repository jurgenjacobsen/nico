import colors from 'colors'
import {
  Guild,
  Message,
  MessageAttachment,
  MessageEmbed,
  TextChannel,
} from 'discord.js'
import { Bot } from '../bot'
import axios from 'axios'

/** Prints as in the console but if the time */
export function print(value: string | number) {
  let d = new Date()
  let m = d.getMonth() + 1
  let dd = d.getDate()
  let h = d.getHours()
  let min = d.getMinutes()
  return console.log(
    `${colors.gray(
      `[${dd > 9 ? dd : `0${dd}`}/${m > 9 ? m : `0${m}`}/${d.getFullYear()}@${
        h > 9 ? h : `0${h}`
      }:${min > 9 ? min : `0${min}`}]`,
    )} ${value}`,
  )
}

/** Parses a message into a suggestion format */
export const suggestion = async (
  bot: Bot,
  message: Message,
): Promise<Message | null> => {
  if (message.content.length < bot.config.suggestion.minLength) return null

  let embeds: MessageEmbed[] = []
  let image = ''

  if (message.attachments.first()) {
    let msg = await (
      bot.channels.cache.get('852689648681353250') as TextChannel
    ).send({
      files: [message.attachments.first() as MessageAttachment],
    })
    image = msg.attachments.first()?.url as string
  }

  embeds.push(
    new MessageEmbed()
      .setColor(bot.config.color)
      .setDescription(message.content)
      .setImage(image ?? '')
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ size: 128, dynamic: true }),
      ),
  )

  message.channel.send({ embeds }).then((msg) => {
    msg
      .react(bot.config.suggestion.up)
      .then(() => msg.react(bot.config.suggestion.down))
    if (message.deletable) message.delete()
  })
  return message
}

/** Look on message content for not allowed discord invites */
export const AntiInvite = async (bot: Bot, message: Message) => {
  let content = message.content
  let links = ['discord.gg/', 'discord.com/invite/']
  for (let link of links) {
    if (
      content.includes(link) &&
      !message.member?.permissions.has('MANAGE_MESSAGES')
    ) {
      try {
        let code = content.split(link)[1].split(' ')[0]
        let invites = await message.guild?.invites.fetch()
        let isGuildInvite = invites?.get(code)

        if (!isGuildInvite) {
          if (message.deletable) message.delete()
          message
            .reply({
              content:
                'Não envie convites de outros servidores aqui! Isso pode resultar em punições.',
            })
            .catch(() => {})

          let { data } = await axios.get(
            `https://discord.com/api/v9/invites/${code}?with_counts=true&with_expiration=true`,
          )
          if (data) {
            let log = bot.channels.cache.get(bot.config.logs.invites)
            let embed = new MessageEmbed()
              .setColor(bot.config.color)
              .setAuthor(
                `${message.author.username} ${
                  message.member?.nickname ? `(${message.member.nickname})` : ``
                }`,
                message.author.displayAvatarURL({ dynamic: true }),
              )
              .setThumbnail(
                `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.webp?size=512`,
              )
              .setFooter(
                `${message.author.tag} enviou um convite de outro servidor!`,
              ).setDescription(`
              **${data.guild.name}**
              ${data.guild.description}
              
              ${data.approximate_member_count} Membros / ${
              data.approximate_presence_count
            } Online
              \n
              Convite criado por: ${
                message.guild?.members.cache.get(data.inviter.id) ??
                data.inviter.username + '#' + data.inviter.discriminator
              }
              `)
            if (data.guild.banner) {
              embed.setImage(
                `https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.jpg?size=1024`,
              )
            }

            ;(log as TextChannel).send({ embeds: [embed] })
          }
        } else {
        }
      } catch {}
    }
  }
}

/** Updates the entire MemberCounter channels */
export const MemberCounter = (bot: Bot, guild: Guild) => {
  let count = guild.memberCount ?? guild.members.cache.size

  let nm: string[] = []
  for (const n of count.toLocaleString().split('')) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(n)) {
      nm.push(`:${toWord(n)}:`)
    }
  }
  let text = bot.config.memberCounterText.replace('{{counter}}', nm.join(''))
  for (let channelId of bot.config.memberCounterChannels) {
    let channel = bot.channels.cache.get(channelId) as TextChannel
    channel.setTopic(text)
  }
}

/** Turns numbers into their names */
export const toWord = (num: number | string) => {
  num = Number(num)
  let n: { [key: number]: string } = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    0: 'zero',
  }
  return n[num]
}

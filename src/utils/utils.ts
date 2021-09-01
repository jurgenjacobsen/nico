import colors from 'colors'
import { ColorResolvable, Guild, GuildMember, Message, MessageAttachment, MessageEmbed, Snowflake, TextChannel, VoiceChannel } from 'discord.js'
import { Bot } from '../bot'
import axios from 'axios'
import { Util } from 'dsc.levels'

/** Prints as in the console but if the time */
export function print(value: string | number) {
  let d = new Date()
  let m = d.getMonth() + 1
  let dd = d.getDate()
  let h = d.getHours()
  let min = d.getMinutes()
  return console.log(
    `${colors.gray(`[${dd > 9 ? dd : `0${dd}`}/${m > 9 ? m : `0${m}`}/${d.getFullYear()}@${h > 9 ? h : `0${h}`}:${min > 9 ? min : `0${min}`}]`)} ${value}`,
  )
}

/** Parses a message into a suggestion format */
export const suggestion = async (bot: Bot, message: Message): Promise<Message | null> => {
  if (message.content.length < bot.config.suggestion.minLength) return null

  let embeds: MessageEmbed[] = []
  let image = ''

  if (message.attachments.first()) {
    let msg = await (bot.channels.cache.get('852689648681353250') as TextChannel).send({
      files: [message.attachments.first() as MessageAttachment],
    })
    image = msg.attachments.first()?.url as string
  }

  embeds.push(
    new MessageEmbed()
      .setColor(bot.config.color)
      .setDescription(message.content)
      .setImage(image ?? '')
      .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 128, dynamic: true })),
  )

  message.channel.send({ embeds }).then((msg) => {
    msg.react(bot.config.suggestion.up).then(() => msg.react(bot.config.suggestion.down))
    if (message.deletable) message.delete()
  })
  return message
}

/** Look on message content for not allowed discord invites */
export const AntiInvite = async (bot: Bot, message: Message) => {
  let content = message.content
  let links = ['discord.gg/', 'discord.com/invite/']
  for (let link of links) {
    if (content.includes(link) && !message.member?.permissions.has('MANAGE_MESSAGES')) {
      try {
        let code = content.split(link)[1].split(' ')[0]
        let invites = await message.guild?.invites.fetch()
        let isGuildInvite = invites?.get(code)

        if (!isGuildInvite) {
          if (message.deletable) message.delete()
          message
            .reply({
              content: 'Não envie convites de outros servidores aqui! Isso pode resultar em punições.',
            })
            .catch(() => {})

          let { data } = await axios.get(`https://discord.com/api/v9/invites/${code}?with_counts=true&with_expiration=true`)
          if (data) {
            let log = bot.channels.cache.get(bot.config.logs.invites)
            let embed = new MessageEmbed()
              .setColor(bot.config.color)
              .setAuthor(
                `${message.author.username} ${message.member?.nickname ? `(${message.member.nickname})` : ``}`,
                message.author.displayAvatarURL({ dynamic: true }),
              )
              .setThumbnail(`https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.webp?size=512`)
              .setFooter(`${message.author.tag} enviou um convite de outro servidor!`).setDescription(`
              **${data.guild.name}**
              ${data.guild.description}
              
              ${data.approximate_member_count} Membros / ${data.approximate_presence_count} Online
              \n
              Convite criado por: ${message.guild?.members.cache.get(data.inviter.id) ?? data.inviter.username + '#' + data.inviter.discriminator}
              `)
            if (data.guild.banner) {
              embed.setImage(`https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.jpg?size=1024`)
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

export const epoch = (time: Date | string | number) => {
  return (new Date(time).getTime() / 1000 + 900 + 330 * 60).toString().split('.')[0]
}

export const VoiceRoles = (bot: Bot, member: GuildMember, channel: VoiceChannel | { id: Snowflake }) => {
  let vconfig = bot.config.voice
  let roles = member.roles.cache.map((r) => r.id)
  let ch = member.guild.channels.cache.get(channel.id)

  if (
    (vconfig.vcRoleChannels.includes(channel.id) || vconfig.vcRolesCats.includes(ch?.parent?.id as string)) &&
    roles.filter((r) => vconfig.vcRoles.includes(r)).length === 0
  ) {
    member.roles
      .add(vconfig.vcRoles)
      .then(() => print(`Cargos de call adicionados em ${member.user.tag}`))
      .catch((err) => {
        print(`Erro ao adicionar cargos de call em ${member.user.tag}`)
        console.error(err)
      })
  }

  if (
    (!vconfig.vcRoleChannels.includes(channel.id) || !vconfig.vcRolesCats.includes(ch?.parent?.id as string)) &&
    roles.filter((r) => vconfig.vcRoles.includes(r)).length > 0
  ) {
    member.roles
      .remove(vconfig.vcRoles)
      .then(() => print(`Cargos de call removido de ${member.user.tag}`))
      .catch((err) => {
        print(`Erro ao remover cargos de call de ${member.user.tag}`)
        console.error(err)
      })
  }

  if (vconfig.eventChannels.includes(channel.id) && roles.filter((r) => vconfig.eventRoles.includes(r)).length === 0) {
    member.roles
      .add(vconfig.eventRoles)
      .then(() => print(`Cargos de call adicionados em ${member.user.tag}`))
      .catch((err) => {
        print(`Erro ao adicionar cargos de evento em ${member.user.tag}`)
        console.error(err)
      })
  }

  if (!vconfig.eventChannels.includes(channel.id) && roles.filter((r) => vconfig.eventRoles.includes(r)).length !== 0) {
    member.roles
      .remove(vconfig.eventRoles)
      .then(() => print(`Cargos de evento removido de ${member.user.tag}`))
      .catch((err) => {
        print(`Erro ao remover cargos de eventos de ${member.user.tag}`)
        console.error(err)
      })
  }
}

export const VoiceCounters = (bot: Bot, member: GuildMember, channel: VoiceChannel) => {
  let guild = member.guild
  let state = guild.voiceStates.cache.get(member.id)

  bot.voiceIntervals.delete(member.id)

  if(!state) return;

  let interval = setInterval(() => {
    bot.stats.guild.update(guild.id, 'voice', 10)

    if (
      bot.config.voice.allowedStatsChannels.includes(channel.id) &&
      bot.config.voice.allowedStatsCats.includes(channel.parent?.id as string) &&
      channel.id !== channel.guild.afkChannelId
    ) {
      bot.stats.users.update(member.id, 'voice', 10)
    }
    
    let xp = Math.floor(Util.random(50, 100))
    if (bot.config.voice.DXPChannels.includes(channel.id)) {
      xp = xp * 2
    } else if (member.roles.cache.find((r) => bot.config.voice.DXPRoles.includes(r.id))) {
      xp = xp * 2
    }

    if (
      bot.config.voice.allowedXPChannels.includes(channel.id) ||
      (bot.config.voice.allowedXPCats.includes(channel.parent?.id as string) && channel.id !== channel.guild.afkChannelId)
    ) {

      if(state?.selfDeaf) {
        // None
      } else if(state?.selfMute) {
        bot.levels.update(member.id, 'VOICE', Math.floor(xp / 3), guild.id)
      } else {
        bot.levels.update(member.id, 'VOICE', xp, guild.id);
      }
    }
  }, 10 * 60 * 1000)
  bot.voiceIntervals.set(member.id, interval)
}

export interface NicoUser {
  name: string | null
  about: string | null
  birthday: Date | null
  location: string | null
  pronoun: string | null
  gender: string | null
  orientation: string | null

  id: string
  bdaynotified: Date | null
  verified: boolean
  badges: string[]
  bannerURL: string | null
  color: ColorResolvable | string | null
  createdAt: Date
}

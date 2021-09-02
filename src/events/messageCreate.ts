import { Message, MessageEmbed, Role } from 'discord.js'
import { EventOptions } from 'dsc.events'
import { Util } from 'dsc.levels'
import { Bot } from '../bot'
import { data } from '../utils/Structures/commands'
import { AntiInvite, print, suggestion } from '../utils/utils'

let cmdregex = /^[%*!?$-+.]/
let cooldowns = new Set()

export const event: EventOptions = {
  name: 'messageCreate',
  once: false,
  run: async (bot: Bot, message: Message) => {
    /**
     * Checks if the author is a bot and if the message was sent inside a guild or not
     */
    if (message.author.bot) return
    if (!message.guild || !message.member) return

    let channel = await message.guild.channels.fetch(message.channelId)
    let category = channel?.parent

    /**
     *  Checks if the message content has any kind of not allowed discord invite
     */
    AntiInvite(bot, message)

    /** If in a suggestion channel it'll format the message as a suggestion */
    if (bot.config.suggestion.channelIds.includes(message.channelId)) {
      suggestion(bot, message)
    }

    let voiceState = message.guild.voiceStates.cache.get(message.author.id)

    /**
     * Adds XP and a random small amount of money to the user
     */
    if (
      (bot.config.allowedXPChannels.includes(message.channelId) || bot.config.allowedXPCats.includes(category?.id as string)) &&
      !cmdregex.test(message.content) &&
      (voiceState ? voiceState.selfMute : true)
    ) {
      let ckey = `MSG_${message.author.id}`
      if (!cooldowns.has(ckey)) {
        cooldowns.add(ckey)
        let xp = Math.floor(Util.random(10, 20))
        if (bot.config.DXPChannels.includes(message.channelId)) {
          xp = xp * 2
        } else if (message.member.roles.cache.find((r) => bot.config.DXPRoles.includes(r.id))) {
          xp = xp * 2
        }
        bot.levels.update(message.author.id, 'TEXT', xp, message.guild.id, (user) => {
          message.channel
            .send({
              embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`🎉 | Você subiu para o nível **${user.textLevel}**!`)],
              reply: { messageReference: message },
            })
            .then((m) => {
              setTimeout(() => {
                if (m.deletable) m.delete()
              }, 10000)
            })
        })
        bot.eco.addMoney(Math.floor(Util.random(1, 5)), message.author.id, message.guild.id)
        setTimeout(() => cooldowns.delete(ckey), 60 * 1000)
      }
    }

    /**
     *  Adds stats to the user
     */
    if (bot.config.allowedStatsChannels.includes(message.channelId) || bot.config.allowedStatsCats.includes(category?.id as string)) {
      if (cmdregex.test(message.content)) {
        bot.stats.users.update(message.author.id, 'commands', 1)
      } else {
        bot.stats.users.update(message.author.id, 'messages', 1)
      }
    }

    /**
     * Adds stats to the guild
     */
    if (cmdregex.test(message.content)) {
      bot.stats.guild.update(message.guild.id, 'commands', 1)
    } else {
      bot.stats.guild.update(message.guild.id, 'messages', 1)
    }

    /**
     * The bot will answer or react to the message when he's mentioned, just for fun. :D
     */
    if (message.mentions.members?.has(bot.user?.id as string) || message.content.toLowerCase().includes('nico')) {
      message.react(`👀`)
    }

    if (message.author.id === '404253084584378389' && message.channel.id === '714634320115138621') {
      let today = new Date()
      let year = today.getFullYear()
      let month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`
      let day = today.getDate() > 9 ? today.getDate() : `0${today.getDate()}`

      message.startThread({
        name: `${day}-${month}-${year}`,
        autoArchiveDuration: 'MAX',
      })
    }

    /**
     * Slash commands manager - Provisory way to manage bot's commands
     */
    if (message.content.startsWith('+update') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+update ', '').trim()
      let cmds = await message.guild.commands.fetch()

      let cmd = cmds.find((c) => c.name === comando)
      let cmd_data = data.find((c) => c.name === comando)
      if (!cmd_data) return
      cmd?.edit(cmd_data)
    }

    if (message.content.startsWith('+create') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+create ', '').trim()
      let cmd_data = data.find((c) => c.name === comando)
      if (!cmd_data) return print('Comando não encontrado nos dados locais!')
      let cmds = await message.guild.commands.fetch()
      let cmd = cmds.find((c) => c.name === comando)
      if (cmd) return print('Comando já existente!')
      message.guild.commands.create(cmd_data)
    }

    if (message.content.startsWith('+delete') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+delete ', '').trim()
      let cmds = await message.guild.commands.fetch()

      let cmd = cmds.find((c) => c.name === comando)
      cmd?.delete()
    }

    if (message.content.startsWith('+perms') && bot.config.devs.ids.includes(message.author.id)) {
      /*let comando = 'config';
      let cmds = await message.guild.commands.fetch()
      let cmd = cmds.find((c) => c.name === comando)

      cmd?.permissions.set({
        permissions: [
          {
            type: 'ROLE',
            id: '739183741515071539',
            permission: true,
          }, 
          {
            type: 'ROLE',
            id: '709450575640789083',
            permission: true,
          }
        ]
      })*/
    }

    if (message.content === '+config' && (bot.config.devs.ids.includes(message.author.id) || message.member.roles.cache.has('739183741515071539'))) {
      /*
      let voice = bot.config.voice
      let text = bot.config.text

      let VOICE_FIELD = `ㅤ
      **VOZ**
      - Cargos que serão dados ao usuário quando um membro entrar em call (${voice.vcRoles.length})
      ${voice.vcRoles.map((r) => `<@&${r}>`).join(`, `)}

      - Canais de voz que darão cargos de call ao entrar (${voice.vcRoleChannels.length})
      ${voice.vcRoleChannels.map((c) => `<#${c}>`).join(`, `)}

      - Categorias que darão cargos de call (${voice.vcRolesCats.length})
      ${voice.vcRolesCats.map((c) => `<#${c}>`).join(', ')}

      - Cargos que serão adicionados quando o membro entrar em um canal de evento (${voice.eventRoles.length})
      ${voice.eventRoles.map((r) => `<@&${r}>`).join(', ')}

      - Canais de evento (${voice.eventChannels.length})
      ${voice.eventChannels.map((c) => `<#${c}>`).join(', ')}

      - Os canais que é permitido contar XP para o usuário (${voice.allowedXPChannels.length})
      ${voice.allowedXPChannels.map((c) => `<#${c}>`).join(', ')}

      - Os canais que é permitido contar estatísticas para o usuário (${voice.allowedStatsChannels.length})
      ${voice.allowedStatsChannels.map((c) => `<#${c}>`).join(', ')}
      
      - As categorias que é permitido contar estatísticas para o usuário (${voice.allowedStatsCats.length})
      ${voice.allowedStatsCats.map((c) => `<#${c}>`).join(', ')}

      - As categorias que é permitido ao usuário receber XP (${voice.allowedXPCats.length})
      ${voice.allowedXPCats.map((c) => `<#${c}>`).join(', ')}

      - Os cargos que receberão o dobro de XP (${voice.DXPRoles.length})
      ${voice.DXPRoles.map((r) => `<@&${r}>`).join(', ')}

      - Os canais que receberão o dobro de XP (${voice.DXPChannels.length})
      ${voice.DXPChannels.map((c) => `<#${c}>`).join(', ')}
      `

      let TEXT_FIELD = `ㅤ
      **TEXTO**
      - Os canais que é permitido receber XP (${text.allowedXPChannels.length})
      ${text.allowedXPChannels.map((c) => `<#${c}>`).join(', ')}

      - Os canais que é permitido contar estatísticas para o usuário (${text.allowedStatsChannels.length})
      ${text.allowedStatsChannels.map((c) => `<#${c}>`).join(`, `)}

      - As categorias que é permitido contar estatísticas para o usuário (${text.allowedStatsCats.length})
      ${text.allowedStatsCats.map((c) => `<#${c}>`).join(', ')}

      - As categorias que é permitido ao usuário receber XP (${text.allowedXPCats.length})
      ${text.allowedXPCats.map((c) => `<#${c}>`).join(', ')}
      
      - Os cargos que receberão o dobro de XP (${text.DXPRoles.length})
      ${text.DXPRoles.map((r) => `<@&${r}>`).join(', ')}

      - Os canais que receberão o dobro de XP (${text.DXPChannels.length})
      ${text.DXPChannels.map((c) => `<#${c}>`).join(', ')}
      `*/
      /*
      message.reply({
        content: VOICE_FIELD,
        allowedMentions: {
          parse: [],
          repliedUser: false,
        },
      })

      message.channel.send({
        content: TEXT_FIELD,
        allowedMentions: {
          parse: [],
          repliedUser: false,
        },
      })*/
    }
  },
}

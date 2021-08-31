import { Message, MessageEmbed } from 'discord.js'
import { EventOptions } from 'dsc.events'
import { Util } from 'dsc.levels'
import { Bot } from '../bot'
import { data } from '../utils/commands'
import { AntiInvite, print, suggestion } from '../utils/utils'

let cmdregex = /^[%*!?$-+]/
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
      (bot.config.text.allowedXPChannels.includes(message.channelId) || bot.config.text.allowedXPCats.includes(category?.id as string)) &&
      !cmdregex.test(message.content) &&
      (voiceState ? voiceState.selfMute : true)
    ) {
      let ckey = `MSG_${message.author.id}`
      if (!cooldowns.has(ckey)) {
        cooldowns.add(ckey)
        let xp = Math.floor(Util.random(15, 25))
        if (bot.config.text.DXPChannels.includes(message.channelId)) {
          xp = xp * 2
        } else if (message.member.roles.cache.find((r) => bot.config.text.DXPRoles.includes(r.id))) {
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
              }, 5000)
            })
        })
        bot.eco.addMoney(Math.floor(Util.random(1, 5)), message.author.id, message.guild.id)
        setTimeout(() => cooldowns.delete(ckey), 60 * 1000)
      }
    }

    /**
     *  Adds stats to the user
     */
    if (bot.config.text.allowedStatsChannels.includes(message.channelId) || bot.config.text.allowedStatsCats.includes(category?.id as string)) {
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
     * Slash commands manager - Provisory way to manage bot's commands
     */
    if (message.content.startsWith('+update') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+update ', '').trim().toLowerCase()
      let cmds = await message.guild.commands.fetch()

      let cmd = cmds.find((c) => c.name === comando)
      let cmd_data = data.find((c) => c.name === comando)
      if (!cmd_data) return
      cmd?.edit(cmd_data)
    }

    if (message.content.startsWith('+create') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+create ', '').trim().toLowerCase()
      let cmd_data = data.find((c) => c.name === comando)
      if (!cmd_data) return print('Comando não encontrado nos dados locais!')
      let cmds = await message.guild.commands.fetch()
      let cmd = cmds.find((c) => c.name === comando)
      if (cmd) return print('Comando já existente!')
      message.guild.commands.create(cmd_data)
    }

    if (message.content.startsWith('+delete') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+delete ', '').trim().toLowerCase()
      let cmds = await message.guild.commands.fetch()

      let cmd = cmds.find((c) => c.name === comando)
      cmd?.delete()
    }

    if(message.content === '+++') {
      console.log(bot.graphics);
      console.log(bot.graphics.cache);
    }
  },
}

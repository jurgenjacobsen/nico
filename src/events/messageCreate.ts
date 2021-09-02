import { Message, MessageEmbed, Role, TextChannel } from 'discord.js'
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
    if (message.mentions.members?.has(bot.user?.id as string) || message.content.toLowerCase().includes(' nico ') || message.content.toLowerCase() === 'nico') {
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
      /*let comando = 'reroll';
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

    /*if(message.content === '+pub') {
      let payload = await bot.eco.store.publish('883038238275682344', {
        labels: {
          buy: 'Comprar',
          price: 'Preço'
        },
        color: bot.config.color,
      })

      let channel = message.guild.channels.cache.get('852216501046214696') as TextChannel;
      if(!payload) return;
      channel.send(payload)
    }*/

    if(message.content === '+auxilio') {
      let eco = await bot.eco.fetch(message.author.id, message.guild.id);
      if(!eco) return;
      if(eco.bank < 1950) {
        await bot.eco.addMoney(1950, message.author.id, message.guild.id)
        message.reply({
          content: 'A Caixa Federal liberou seu auxilio!'
        })
      }
    }
  },
}

import { Interaction, TextChannel } from 'discord.js'
import { EventOptions } from 'dsc.events'
import { Bot } from '../bot'
import { print } from '../utils/utils'

export const event: EventOptions = {
  name: 'interactionCreate',
  once: false,
  run: (bot: Bot, interaction: Interaction) => {
    if (interaction.isCommand()) {
      bot.stats.users.update(interaction.user.id, 'commands', 1)
      
      if(interaction.guild) {
        bot.stats.guild.update(interaction.guild.id as string, 'commands', 1);
      }

      print(`${interaction.user.tag} usou o comando /${interaction.commandName} em #${(interaction.channel as TextChannel).name}`)
    }
  },
}

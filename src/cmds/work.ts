import { CommandInteraction, MessageEmbed } from "discord.js";
import { CommandOptions } from "dsc.cmds";
import { EcoUser, User } from "dsc.eco";
import { Bot } from "../bot";

export const cmd: CommandOptions = {
  name: 'work',
  devOnly: true,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {

    let timeout = 6 * 60 * 60 * 1000;
    let user = await bot.eco.fetch(interaction.user.id, interaction.guild?.id);
    let response = await bot.eco.work(interaction.user.id, interaction.guild?.id, {
      timeout: timeout,
      money: {
        min: 100,
        max: 250,
      }
    });

    if(response?.err) {
      switch(response.err) {
        case 'COOLDOWN': {
          let remaining = '';

          if(response.remaining) {
            if(response.remaining.hours > 0) {
              remaining = ` ${response.remaining.hours}h ${response.remaining.minutes}m `;
            } else if(response.remaining.minutes > 0) {
              remaining = ` ${response.remaining.minutes}m ${response.remaining.seconds}s `
            } else if(response.remaining.seconds > 1) {
              remaining = ` ${response.remaining.seconds}s `
            } else {
              remaining = ` um segundo `
            }
          }

          let embed = new MessageEmbed()
          .setColor(bot.config.color)
          .setDescription(`Você deve esperar${remaining}para trabalhar novamente!`);

          return interaction.reply({ 
            embeds: [embed] 
          });  
        };
        break;
        default: {
          return interaction.reply({
            content: `Houve um erro ao coletar o \`/work\`.`,
          });
        }
      }
    }

    if(!response) {
      return interaction.reply({
        content: `Houve um erro ao coletar o \`/work\`.`,
      });
    };

    if(!user) {
      user = await bot.eco.fetch(interaction.user.id, interaction.guild?.id) as User;
    }

    
    let embed = new MessageEmbed()
    .setColor(bot.config.color)
    .setDescription(`Você recebeu **$${user.wallet > response.user.wallet ? (user.wallet - response.user.wallet) : (response.user.wallet - user.wallet)}** por trabalhar para Dema!`)
    .setFooter(`Você têm um total de $${response.user.bank + response.user.wallet}!`);

    return interaction.reply({
      embeds: [ embed ],
    });

  }
}
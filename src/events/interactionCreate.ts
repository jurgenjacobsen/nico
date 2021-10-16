import { GuildMember, Interaction, Message, MessageEmbed, TextChannel } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';
import { print } from '../Utils/utils';

const like_reg = /\d?\d?\d?\d[ 👍]/g;

export const event: EventOptions = {
  name: 'interactionCreate',
  once: false,
  run: async (bot: Bot, interaction: Interaction) => {
    if (interaction.isCommand()) {
      bot.stats.users.update(interaction.user.id, 'commands', 1);

      if (interaction.guild) {
        bot.stats.guild.update(interaction.guild.id as string, 'commands', 1);
      }

      print(`${interaction.user.tag} usou o comando /${interaction.commandName} em #${(interaction.channel as TextChannel).name}`);
    } else if (interaction.isButton()) {
      if (!interaction.channel) return;
      if (!interaction.guild) return;

      let rawId = interaction.customId;

      if (rawId.startsWith(`ITEM_`) && rawId.endsWith(`_BUY`) && bot.config.storeChannel === interaction.channel.id) {
        let id = rawId.replace(`ITEM_`, '').replace(`_BUY`, ``).trim();
        bot.eco.store
          .buy(id, interaction.user.id, interaction.guild.id)
          .then((res) => {
            if (res.err && res.err === 'NOT_ENOUGH_MONEY') {
              return interaction.reply({
                ephemeral: true,
                content: '💳 | Você não tem dinheiro suficiente!',
              });
            }
            return interaction.reply({
              ephemeral: true,
              content: '💳 | Compra efetuada com sucesso!',
            });
          })
          .catch((err) => {
            console.log(err);
          });
        return;
      }
    }
  },
};

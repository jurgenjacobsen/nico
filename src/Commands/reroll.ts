import { CommandInteraction } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'reroll',
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let id = interaction.options.getString('id', true);

    bot.giveaways
      .reroll(id, {
        messages: {
          congrat: `🎉 Novo(s) vencedor(es): {winners}! Parabéns, você(s) ganhou/ganharam **{this.prize}**! *Resorteado*\n{this.messageURL}`,
          error: 'Sem participantes válidos!',
        },
      })
      .then(() => {
        return interaction.reply({
          content: `Sorteio foi re-sorteado!`,
        });
      })
      .catch((err) => {
        console.error(err);
        return interaction.reply({
          content: `Houve um erro ao resortear o sorteio!`,
        });
      });
  },
};

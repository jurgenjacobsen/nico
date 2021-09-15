import { CommandInteraction, StageChannel, TextChannel, ThreadChannel, VoiceChannel } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';
import ms from 'ms';

export const cmd: CommandOptions = {
  name: 'giveaway',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let duration = interaction.options.getString('duração', true);
    let winnerCount = interaction.options.getInteger('vencedores', true);
    let prize = interaction.options.getString('prêmio', true);
    let ch = interaction.options.getChannel('canal', true);

    let channel = interaction.guild?.channels.cache.get(ch.id) as TextChannel;

    if (!channel || channel instanceof VoiceChannel || channel instanceof StageChannel)
      return interaction.reply({
        content: `Canal inválido!`,
        ephemeral: true,
      });

    try {
      bot.giveaways
        .start(channel, {
          duration: ms(duration),
          winnerCount: winnerCount,
          prize: prize,
          messages: {
            giveaway: '🎉 | Sorteio',
            giveawayEnded: '⏰ | Sorteio encerrado!',
            inviteToParticipate: 'Reaja com 🎉 para participar!',
            winMessage: 'Parabéns, {winners}! Você(s) ganharam **{this.prize}**!',
            drawing: 'Restante: {timestamp}',
            dropMessage: 'Seja o primeiro a reagir com 🎉!',
            noWinner: 'Sorteio cancelado, sem participantes válidos.',
            winners: 'Vencedor(es):',
            endedAt: 'Encerrado em',
            hostedBy: 'Patrocinado por: ${this.hostedBy}',
          },
        })
        .catch(() => {});
    } catch {
      return interaction
        .reply({
          content: `Erro ao criar sorteio!`,
          ephemeral: true,
        })
        .catch(() => {});
    }

    return interaction
      .reply({
        content: `Sorteio criado com sucesso!`,
        ephemeral: true,
      })
      .catch(() => {});
  },
};

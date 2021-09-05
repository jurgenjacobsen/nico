import { DiscordTogether } from 'discord-together';
import { CommandInteraction } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'together',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let together = new DiscordTogether(bot);
    let type = interaction.options.getString('type', true);
    let member = interaction.guild?.members.cache.get(interaction.user.id);
    if (!member) return;
    if (!member.voice.channelId)
      return interaction.reply({
        content: `Você deve estar em um canal de voz para isso!`,
      });

    let invite = await together.createTogetherCode(member.voice.channelId, type);
    if (!invite) return interaction.reply({ content: 'Houve um erro ao executar esta ação' });

    interaction
      .reply({
        content: `[Entrar](${invite.code})`,
      })
      .catch(() => {});
  },
};

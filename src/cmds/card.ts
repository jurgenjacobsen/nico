import { CommandInteraction, MessageAttachment } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';
import { Rank } from 'canvacord';
import { NicoUser } from '../utils/utils';

export const cmd: CommandOptions = {
  name: 'card',
  guildOnly: true,
  devOnly: false,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let tipo = interaction.options.getString('tipo', true) as 'TEXT' | 'VOICE';
    let user = interaction.options.getUser('membro', false) ?? interaction.user;

    let data = await bot.levels.fetch(user.id, interaction.guild?.id);
    let leaderboard = await bot.levels.leaderboard({ type: tipo, guildID: interaction.guild?.id });

    let raw = await bot.db.members.fetch(user.id);

    if (!raw)
      return interaction
        .reply({
          content: `
          ${
            user.id === interaction.user.id
              ? `Não foi possível encontrar o seu perfil! Utilize \`/profile create\`, para criar um novo perfil!`
              : `${user.tag} não possue um perfil!`
          }`,
        })
        .catch(() => {});

    let profile = raw.data as NicoUser;

    if (!data) return;

    let card = new Rank()
      .setAvatar(user.displayAvatarURL({ dynamic: false, size: 256, format: 'png' }))
      .setUsername(user.username)
      .setDiscriminator(user.discriminator)
      .renderEmojis(true)
      .setRank(leaderboard.find((l) => l.userID === user.id)?.pos ?? 0, 'Rank')
      .setBackground(profile.card.backgroundType, profile.card.background)
      .setOverlay('#1c1c1c', profile.card.overlayOpacity)
      .setCustomStatusColor('#1c1c1c')
      .setLevelColor('#FFFFFF', profile.card.levelColor)
      .setRankColor('#FFFFFF', profile.card.rankColor)
      .setProgressBar(profile.card.progressBarColor);

    switch (tipo) {
      case 'TEXT':
        {
          card.setCurrentXP(data.textXp);
          card.setRequiredXP(bot.levels.getTotalXPToLevelUp(data.textLevel, data.textXp));
          card.setLevel(data.textLevel, 'Nível');
        }
        break;
      case 'VOICE':
        {
          card.setCurrentXP(data.voiceXp);
          card.setRequiredXP(bot.levels.getTotalXPToLevelUp(data.voiceLevel, data.voiceXp));
          card.setLevel(data.voiceLevel, 'Nível');
        }
        break;
    }

    let buffer = await (card as any).build();
    let file = new MessageAttachment(buffer, 'card.png');

    return interaction
      .reply({
        files: [file],
      })
      .catch(() => {});
  },
};

import { Queue, Track } from 'discord-player';
import { CommandInteraction, Guild, MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';
import { dots } from '../utils/utils';

export const cmd: CommandOptions = {
  name: 'sotw',
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let sub = interaction.options.getSubcommand() as 'show' | 'recommend';

    switch (sub) {
      case 'recommend':
        {
          let url = interaction.options.getString('url', true);
          let nota = interaction.options.getString('nota', false);

          let track = await bot.player
            .search(url, {
              requestedBy: interaction.user.id,
            })
            .then((response) => response.tracks[0]);

          if (!track) {
            return interaction.reply({
              content: 'Música não encontrada!',
            });
          }

          let embed = new MessageEmbed()
            .setColor(bot.config.color)
            .setAuthor(interaction.user.username, interaction.user.displayAvatarURL({ dynamic: true, size: 128 }))
            .setDescription(
              `
          Título: ${track.title}
          Autor: ${track.author}
          Duração: ${track.duration}
          ID: ${track.id}

          ${nota ? `Nota: ${nota}` : ''}
          `,
            )
            .setThumbnail(track.thumbnail)
            .setFooter(track.url);

          let channel = bot.channels.cache.get('840045583028715541') as TextChannel;
          channel.send({
            embeds: [embed],
            components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`ADD_SOTW_${track.id}`).setLabel('Aprovar').setStyle('SUCCESS'))],
          });

          return interaction.editReply({
            content: 'Sugestão efetuada com sucesso!',
          });
        }
        break;
      case 'show':
        {
          let queue = bot.player.getQueue(interaction.guild as Guild);
          if (!queue) return;
          let np: Track | undefined = undefined;
          try {
            np = queue.nowPlaying();
          } catch {}

          let rawSotws = await bot.db.sotw.list();
          if (!rawSotws) return;
          let sotws = rawSotws
            .map((data) => data.data)
            .sort((a, b) => b.likes.length - a.likes.length)
            .slice(0, 10);
          let pos = 1;
          let embed = new MessageEmbed().setColor(bot.config.color).setAuthor('Músicas da semana').setDescription(`
          **Tocando Agora**
          ${np ? `[${np?.title}](${np?.url}) - \`[${np?.duration}]\`` : '*Nada*'}
          
          **TOP 10**
          ${sotws.map((song) => `#${pos++} - [${dots(song.name, 45)}](${song.url}) - \`${song.played} 🎶\` | \`${song.likes.length} 👍\``).join(`\n`)}
        `);

          return interaction.reply({
            embeds: [embed],
          });
        }
        break;
    }
  },
};

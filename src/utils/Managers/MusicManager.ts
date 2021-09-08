import { Track } from 'discord-player';
import { MessageActionRow, MessageButton, MessageEmbed, TextChannel, Collection, Snowflake, User, VoiceChannel, Guild } from 'discord.js';
import { Bot } from '../../bot';
import { dots, print } from '../utils';

let cache = new Set();

export const MusicManager = (bot: Bot) => {
  bot.player.on('trackEnd', () => {
    play(bot);
  });

  bot.player.on('queueEnd', () => {
    play(bot);
  });

  bot.player.on('botDisconnect', () => {
    play(bot);
  });

  bot.player.on('connectionError', () => {
    play(bot);
  });

  bot.player.on('trackStart', async (q, track) => {
    let channel = bot.channels.cache.get('766050231561093170') as TextChannel;
    let sotw = await bot.db.sotw.fetch({ 'data.url': track.url });

    if (!sotw) return;
    if (cache.has(sotw.data.id)) return;

    cache.add(sotw.data.id);
    setTimeout(() => {
      cache.delete(sotw?.data.id);
    }, 30 * 1000);
    channel
      .send({
        embeds: [
          new MessageEmbed()
            .setColor(bot.config.color)
            .setThumbnail(track.thumbnail)
            .setDescription(
              `
            Tocando [${dots(track.title, 84)}](${track.url})\n
            \`${sotw.data.likes.length ?? 0} 👍\`ㅤㅤㅤ\`${sotw.data.played} 🎶\`ㅤㅤㅤ\`${track.duration} ⏰\`
            `,
            )
            .setFooter(`Recomende uma música para a playlist de músicas da semana! /sotw`),
        ],
        components: [new MessageActionRow().addComponents(new MessageButton().setCustomId(`LIKE_SONG_${sotw.data.id}`).setEmoji('👍').setStyle('SECONDARY'))],
      })
      .catch((err) => console.log(err));
  });
};

export const play = async (bot: Bot) => {
  let guild = bot.guilds.cache.get('465938334791893002') as Guild;
  let channel = guild.channels.cache.get('677321568791167019') as VoiceChannel;
  let queue = bot.player.createQueue(guild, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
    autoSelfDeaf: true,
    initialVolume: 20,
  });

  try {
    if (!queue.connection) await queue.connect(channel);
  } catch {
    try {
      queue.destroy();
      return print('Houve um erro na conexão da lista de reprodução.');
    } catch {}
  }

  let raw = await bot.db.sotw.list();
  if (!raw) return;
  let data = raw
    .map((d) => d.data)
    .sort((a, b) => b.lastPlay.getTime() - a.lastPlay.getTime())
    .slice(1)
    .sort((a, b) => a.played - b.played);
  let rawTrack = data[0];
  if (!rawTrack) return print('Track raw não encontrada');

  let track: Track | undefined = undefined;
  try {
    track = (await bot.player
      .search(rawTrack.url, {
        requestedBy: (bot.user as User).id,
      })
      .then((x) => x.tracks[0])
      .catch((err) => {})) as Track;
  } catch {}

  if (!track) return print(`Track não encontrada`);

  try {
    queue.addTrack(track);
    queue.play().catch((err) => console.log(err));
  } catch {
    return print(`Houve um erro ao tocar a música.`);
  }

  await bot.db.sotw.add(`${rawTrack.id}.played`, 1);
  await bot.db.sotw.set(`${rawTrack.id}.lastPlay`, new Date());
};

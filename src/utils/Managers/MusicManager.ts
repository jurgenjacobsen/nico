import { MessageActionRow, MessageButton, MessageEmbed, TextChannel, Collection, Snowflake, VoiceChannel } from 'discord.js';
import { Bot } from '../../bot';
import { dots, print } from '../utils';
import { promisify } from 'util';

let wait = promisify(setTimeout);
let cache = new Set();

export const MusicManager = async (bot: Bot) => {
  await wait(2000);
  print('Inicializando player!');
  play(bot);
  
  bot.player.on('connectionError', (q, err) => {
    print(`Houve um erro ao tocar uma música:\n${err}`);
    q.destroy();
    setTimeout(() => {
      play(bot);
    }, 15*1000)
  });

  bot.player.on('error', (q, err) => {
    print(`Houve um erro ao tocar uma música:\n${err}`);
    q.destroy();
    setTimeout(() => {
      play(bot);
    }, 15*1000)
  });

  bot.player.on('trackEnd', () => {
    play(bot);
  });

  bot.player.on('queueEnd', () => {
    play(bot);
  });

  bot.player.on('trackStart', async (q, track) => {
    if(cache.has(track.url)) return print(track.title + ' esta no cache!');
    cache.add(track.url);
    setTimeout(() => cache.delete(track.url), 15 * 1000);

    print(`[MÚSICA] ${track.title} começou a tocar!`);
    
    let sotw = await bot.db.sotw.fetch({ 'data.url': track.url }).then((song) => song?.data);
    if(!sotw) return print(`${track.title} não encontrada no sotw`);

    let channel = bot.channels.cache.get('766050231561093170') as TextChannel;

    let msg = await channel.send({
      embeds: [
        new MessageEmbed()
        .setColor(bot.config.color)
        .setThumbnail(track.thumbnail)
        .setAuthor('Tocando')
        .setDescription(
        `[${dots(track.title, 84)}](${track.url})\n
        \`${sotw.likes.length ?? 0} 👍\`ㅤㅤㅤ\`${sotw.played} 🎶\`ㅤㅤㅤ\`${track.duration} ⏰\`
        `,
        )
        .setFooter(`Recomende uma música para a playlist usando /sotw!`),
      ],
      components: [
        new MessageActionRow().addComponents([
          new MessageButton().setCustomId(`LIKE_SONG_${sotw.id}`).setEmoji('👍').setStyle('SECONDARY'),
          new MessageButton().setCustomId(`DISLIKE_SONG_${sotw.id}`).setEmoji('👎').setStyle('SECONDARY'),
          new MessageButton().setCustomId(`FAVORITE_SONG_${sotw.id}`).setEmoji('⭐').setStyle('SECONDARY'),
          new MessageButton().setCustomId(`SKIP_SOUND`).setEmoji('⏭️').setStyle('SECONDARY'),
        ]),
      ],
    }).then((m) => m).catch((err) => {
      console.log(err);
    });

    setTimeout(async () => {
      if(!msg) return;
      try {
        if(msg?.deletable) msg?.delete().catch(err => {});
      } catch {}
    }, track.durationMS);
  });
};

export const play = async (bot: Bot) => {
  let sotw = await bot.db.sotw.list().then((raw) => raw?.map((r) => r.data));
  if(!sotw) return print(`Sotw não encontrada!`);

  let channels = bot.channels.cache as Collection<Snowflake, VoiceChannel>;
  let channel: VoiceChannel | undefined = channels.get('677321568791167019');;

  if(!channel) return print(`Canal não encontrado!`);
  if(channel?.members.find((m) => m.user.bot && m.id !== bot.user?.id)) return print(`Canal já está com um bot tocando música!`);

  sotw = sotw.sort((a, b) => {
    return b.lastPlay.getTime() - a.lastPlay.getTime();
  });

  sotw = shuffle(sotw);

  let search = await bot.player.search(sotw[0].url, {
    requestedBy: '831653654426550293'
  });

  if(!search || !search.tracks.length) {
    print(`Nenhum resultado para esta música!`);
    play(bot);
    return;
  };

  const queue = bot.player.createQueue(bot.config.guild, {
    leaveOnEnd: false,
    leaveOnStop: false,
    leaveOnEmpty: false,
    initialVolume: 10,
  });

  try {
    if (!queue.connection) await queue.connect(channel);
  } catch {
    console.log('Houve um erro ao se conectar em um canal de voz!');
    void bot.player.deleteQueue(bot.config.guild);
    play(bot);
    return;
  }

  search.playlist ? queue.addTracks(search.tracks) : queue.addTrack(search.tracks[0]);
  if(!queue.playing) await queue.play().catch((err) => {
    print(`Houve um erro ao tocar uma música:\n${err}`);
  });

  await bot.db.sotw.add(`${sotw[0].id}.played`, 1);
  await bot.db.sotw.set(`${sotw[0].id}.lastPlay`, new Date());
}

function shuffle(array: any[]): any[] {
  var currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

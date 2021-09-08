import colors from 'colors';
import {
  ColorResolvable,
  CommandInteraction,
  Guild,
  GuildMember,
  Message,
  MessageAttachment,
  MessageEmbed,
  Snowflake,
  TextChannel,
  User,
  VoiceChannel,
} from 'discord.js';
import { Bot } from '../bot';
import axios from 'axios';
import { Util } from 'dsc.levels';
import { Queue, Track } from 'discord-player';

export let imgur_re = /^(https?:)?\/\/(\w+\.)?imgur\.com\/(\S*)(\.[a-zA-Z]{3})$/;
export let hex_re = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

/** Prints as in the console but if the time */
export function print(value: string | number) {
  let d = new Date();
  let m = d.getMonth() + 1;
  let dd = d.getDate();
  let h = d.getHours();
  let min = d.getMinutes();
  return console.log(
    `${colors.gray(`[${dd > 9 ? dd : `0${dd}`}/${m > 9 ? m : `0${m}`}/${d.getFullYear()}@${h > 9 ? h : `0${h}`}:${min > 9 ? min : `0${min}`}]`)} ${value}`,
  );
}

/** Parses a message into a suggestion format */
export const suggestion = async (bot: Bot, message: Message): Promise<Message | null> => {
  if (message.content.length < bot.config.suggestion.minLength) return null;

  let embeds: MessageEmbed[] = [];
  let image = '';

  if (message.attachments.first()) {
    let msg = await (bot.channels.cache.get('852689648681353250') as TextChannel).send({
      files: [message.attachments.first() as MessageAttachment],
    });
    image = msg.attachments.first()?.url as string;
  }

  embeds.push(
    new MessageEmbed()
      .setColor(bot.config.color)
      .setDescription(message.content)
      .setImage(image ?? '')
      .setAuthor(message.author.username, message.author.displayAvatarURL({ size: 128, dynamic: true })),
  );

  message.channel.send({ embeds }).then((msg) => {
    msg.react(bot.config.suggestion.up).then(() => msg.react(bot.config.suggestion.down));
    if (message.deletable) message.delete();
  });
  return message;
};

/** Look on message content for not allowed discord invites */
export const AntiInvite = async (bot: Bot, message: Message) => {
  let content = message.content;
  let links = ['discord.gg/', 'discord.com/invite/'];
  for (let link of links) {
    if (content.includes(link) && !message.member?.permissions.has('MANAGE_MESSAGES')) {
      try {
        let code = content.split(link)[1].split(' ')[0];
        let invites = await message.guild?.invites.fetch();
        let isGuildInvite = invites?.get(code);

        if (!isGuildInvite) {
          if (message.deletable) message.delete();
          message
            .reply({
              content: 'Não envie convites de outros servidores aqui! Isso pode resultar em punições.',
            })
            .catch(() => {});

          let { data } = await axios.get(`https://discord.com/api/v9/invites/${code}?with_counts=true&with_expiration=true`);
          if (data) {
            let log = bot.channels.cache.get(bot.config.logs.invites);
            let embed = new MessageEmbed()
              .setColor(bot.config.color)
              .setAuthor(
                `${message.author.username} ${message.member?.nickname ? `(${message.member.nickname})` : ``}`,
                message.author.displayAvatarURL({ dynamic: true }),
              )
              .setThumbnail(`https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.webp?size=512`)
              .setFooter(`${message.author.tag} enviou um convite de outro servidor!`).setDescription(`
              **${data.guild.name}**
              ${data.guild.description}
              
              ${data.approximate_member_count} Membros / ${data.approximate_presence_count} Online
              \n
              Convite criado por: ${message.guild?.members.cache.get(data.inviter.id) ?? data.inviter.username + '#' + data.inviter.discriminator}
              `);
            if (data.guild.banner) {
              embed.setImage(`https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.jpg?size=1024`);
            }

            (log as TextChannel).send({ embeds: [embed] });
          }
        } else {
        }
      } catch {}
    }
  }
};

/** Updates the entire MemberCounter channels */
export const MemberCounter = (bot: Bot, guild: Guild) => {
  let count = guild.memberCount ?? guild.members.cache.size;

  let nm: string[] = [];
  for (const n of count.toLocaleString().split('')) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(n)) {
      nm.push(`:${toWord(n)}:`);
    }
  }
  let text = bot.config.memberCounterText.replace('{{counter}}', nm.join(''));
  for (let channelId of bot.config.memberCounterChannels) {
    let channel = bot.channels.cache.get(channelId) as TextChannel;
    channel.setTopic(text);
  }
};

/** Turns numbers into their names */
export const toWord = (num: number | string) => {
  num = Number(num);
  let n: { [key: number]: string } = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine',
    0: 'zero',
  };
  return n[num];
};

export const epoch = (time: Date | string | number) => {
  return (new Date(time).getTime() / 1000 + 900 + 330 * 60).toString().split('.')[0];
};

export const VoiceRoles = (bot: Bot, member: GuildMember, channel: VoiceChannel | { id: Snowflake; parentId: Snowflake | null }) => {
  let config = bot.config;
  let roles = member.roles.cache.map((r) => r.id);

  if (member.user.bot) return;

  if (config.vcRoleChannels.includes(channel.id) || (config.vcRolesCats.includes(channel.parentId as string) && channel.id !== member.guild.afkChannelId)) {
    config.vcRoles.forEach((id) => {
      if (!member.roles.cache.has(id)) {
        member.roles
          .add(id)
          .then(() => print(`Cargos de call adicionados em ${member.user.tag}`))
          .catch((err) => {
            print(`Erro ao adicionar cargos de call em ${member.user.tag}`);
            console.error(err);
          });
      }
    });
  } else if (roles.find((r) => config.vcRoles.includes(r))) {
    member.roles
      .remove(config.vcRoles)
      .then(() => print(`Cargos de call removido de ${member.user.tag}`))
      .catch((err) => {
        print(`Erro ao remover cargos de call de ${member.user.tag}`);
        console.error(err);
      });
  }

  if (config.eventChannels.includes(channel.id)) {
    config.eventRoles.forEach((id) => {
      if (!member.roles.cache.has(id)) {
        member.roles
          .add(id)
          .then(() => print(`Cargos de call adicionados em ${member.user.tag}`))
          .catch((err) => {
            print(`Erro ao adicionar cargos de evento em ${member.user.tag}`);
            console.error(err);
          });
      }
    });
  } else if (roles.find((r) => config.eventRoles.includes(r))) {
    member.roles
      .remove(config.eventRoles)
      .then(() => print(`Cargos de evento removido de ${member.user.tag}`))
      .catch((err) => {
        print(`Erro ao remover cargos de eventos de ${member.user.tag}`);
        console.error(err);
      });
  }
};

export const VoiceCounters = (bot: Bot, member: GuildMember, channel: VoiceChannel) => {
  let guild = member.guild;
  let state = guild.voiceStates.cache.get(member.id);

  let counter = bot.voiceIntervals.get(member.id);
  if (counter) {
    clearInterval(counter);
  }
  bot.voiceIntervals.delete(member.id);

  if (member.user.bot) return print(`${member.user.tag} é um bot.`);
  if (!state) return print(`Não foi possível encontrar o voice state de ${member.user.tag}!`);
  if (channel.id === member.guild.afkChannelId) return print(`${member.user.tag} entrou no canal AFK!`);

  let interval = setInterval(() => {
    bot.stats.guild.update(guild.id, 'voice', 10);

    if (bot.config.allowedStatsChannels.includes(channel.id) || bot.config.allowedStatsCats.includes(channel.parent?.id as string)) {
      bot.stats.users.update(member.id, 'voice', 10);
    }

    let xp = Math.floor(Util.random(50, 100));
    if (bot.config.DXPChannels.includes(channel.id)) {
      xp = xp * 2;
    } else if (member.roles.cache.find((r) => bot.config.DXPRoles.includes(r.id))) {
      xp = xp * 2;
    }

    if (bot.config.allowedXPChannels.includes(channel.id) || bot.config.allowedXPCats.includes(channel.parent?.id as string)) {
      if (state?.selfMute) {
        bot.levels.update(member.id, 'VOICE', Math.floor(xp / 3), guild.id);
      } else {
        bot.levels.update(member.id, 'VOICE', xp, guild.id);
      }
    }
  }, 10 * 60 * 1000);
  bot.voiceIntervals.set(member.id, interval);
};

export class Nic extends Error {
  public code: string;
  public message: string;
  constructor(code: string | number, message: string, extra?: { err?: Error | string; ref: Message | CommandInteraction }) {
    super();
    Error.captureStackTrace(this, this.constructor);

    this.code = colors.yellow(`[NIC${code}]`);
    this.message = message;

    print(`${this.code} ${this.message}`);

    this.name = this.code;
    this.message = this.message;

    let content = `\`[NIC${code}]\` | Ocorreu um erro, verifique a tabela de erros em <#861743115357388821> para saber mais!`;

    if (extra?.ref && extra.ref instanceof Message) {
      extra.ref.reply({ content });
    } else if (extra?.ref && extra.ref instanceof CommandInteraction) {
      if (extra.ref.replied || extra.ref.deferred) {
        extra.ref.editReply({ content });
      } else {
        extra.ref.reply({ content });
      }
    }

    if (extra?.err) {
      console.error(extra.err);
    }
  }
}

export function dots(string: string, length: number) {
  if (string.length > length) return string.substring(0, length) + '...';
  else return string;
}

export interface NicoUser {
  name: string | null;
  about: string | null;
  birthday: Date | null;
  location: string | null;
  pronoun: string | null;
  gender: string | null;
  orientation: string | null;

  card: {
    overlayOpacity: number;
    levelColor: HEX;
    rankColor: HEX;
    progressBarColor: HEX;
    backgroundType: 'IMAGE' | 'COLOR';
    background: string;
  };

  id: string;
  bdaynotified: Date | null;
  verified: boolean;
  badges: string[];
  bannerURL: string | null;
  color: ColorResolvable | string | null;
  createdAt: Date;
}

export interface SongOfTheWeek {
  id: Snowflake;
  name: string;
  url: string;
  played: number;
  lastPlay: Date;
  likes: Snowflake[];
  addedAt: Date;
}

export type HEX = `#${string}`;

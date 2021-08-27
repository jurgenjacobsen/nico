import colors from 'colors';
import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { Bot } from '../bot';
import axios from 'axios'

export function print(value: string | number) {
  let d = new Date();
  let m = d.getMonth() + 1;
  let dd = d.getDate();
  let h = d.getHours();
  let min = d.getMinutes();
  return console.log(`${colors.gray(`[${dd > 9 ? dd : `0${dd}`}/${m > 9 ? m : `0${m}`}/${d.getFullYear()}@${h > 9 ? h : `0${h}`}:${min > 9 ? min : `0${min}`}]`)} ${value}`);
}

export const suggestion = async (bot: Bot, message: Message) => {
  
}

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
                .setAuthor(`${message.author.username} ${message.member?.nickname ? `(${message.member.nickname})` : ``}`, message.author.displayAvatarURL({ dynamic: true }))
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
}
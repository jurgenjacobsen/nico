import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import moment from 'moment';
import { Bot } from '../bot';
import { badges } from '../utils/Structures/badges';
import { NicoUser } from '../utils/utils';

export const cmd: CommandOptions = {
  name: 'profile',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    switch (interaction.options.getSubcommand()) {
      case 'show':
        {
          let user = interaction.options.getUser('membro');
          if (!user) user = interaction.user;

          let u = await bot.db.members.fetch(user.id);
          if (!u)
            return interaction
              .reply({
                content: `Não foi possível encontrar o perfil de ${user.tag}! Utilize **/profile create**, para criar um novo perfil!`,
              })
              .catch(() => {});

          let data: NicoUser = u.data;
          let inline = true;

          let embed = new MessageEmbed()
            .setColor(`${data.color ?? bot.config.color}` as any)
            .setAuthor(user.username, user.displayAvatarURL({ dynamic: true, size: 256 }))
            .addFields([
              { name: 'Nome', value: `${data.name ?? 'ㅤ'}`, inline },
              { name: 'Localização', value: `${data.location ?? 'ㅤ'}`, inline },
              { name: 'Pronome', value: `${data.pronoun ?? 'ㅤ'}`, inline },
              { name: 'Gênero', value: `${data.gender ?? 'ㅤ'}`, inline },
              { name: 'Orientação', value: `${data.orientation ?? 'ㅤ'}`, inline },
              { name: 'Aniversário', value: `${data.birthday ? moment(data.birthday).format('DD/MM/YYYY') : 'ㅤ'}`, inline },
              {
                name: 'Badges',
                value: `${badges.LIST.filter((b) => data.badges.includes(b.id))
                  .map((b) => b.emoji)
                  .join(' ')}ㅤ`,
              },
            ])
            .setDescription(
              `
        ${data.about ?? ''}\n
        `,
            )
            .setImage(`${data.bannerURL !== null ? data.bannerURL : ''}`);

          if (data.verified) embed.setFooter(`Verificado`);
          return interaction
            .reply({
              embeds: [embed],
            })
            .catch(() => {});
        }
        break;

      case 'edit':
        {
          let data = await bot.db.members.fetch(interaction.user.id);
          if (!data)
            return interaction.reply({
              content: `Não foi possível editar seu perfil, você ainda não possue um. Se precisar de ajuda contate o suporte.`,
            });

          let user: NicoUser = data.data;

          let newData: NicoUser = {
            id: user.id,
            name: interaction.options.getString('nome') ?? user.name,
            about: interaction.options.getString('sobre') ?? user.about,
            location: interaction.options.getString('localização') ?? user.location,
            pronoun: interaction.options.getString('pronome') ?? user.pronoun,
            gender: interaction.options.getString('gênero') ?? user.gender,
            orientation: interaction.options.getString('orientação') ?? user.orientation,
            birthday: parseDate(interaction.options.getString('aniversário')) ?? user.birthday,
            card: {
              overlayOpacity: user.card.overlayOpacity,
              levelColor: user.card.levelColor,
              rankColor: user.card.rankColor,
              progressBarColor: user.card.progressBarColor,
              backgroundType: user.card.backgroundType,
              background: user.card.background,
            },
            bdaynotified: user.bdaynotified,
            verified: user.verified,
            badges: user.badges,
            bannerURL: user.bannerURL,
            color: user.color,
            createdAt: user.createdAt,
          };

          await bot.db.members.set(interaction.user.id, newData);

          return interaction
            .reply({
              content: `Seu perfil foi editado com sucesso!`,
            })
            .catch(() => {});
        }
        break;

      case 'create':
        {
          let data = await bot.db.members.fetch(interaction.user.id);
          if (data)
            return interaction.reply({
              content: `Não foi possível criar um perfil, aparentemente seu perfil já existe. Se houver algum problema contate o suporte.`,
            });
          let bday = parseDate(interaction.options.getString('aniversário'));

          let newData: NicoUser = {
            name: interaction.options.getString('nome'),
            about: interaction.options.getString('sobre'),
            location: interaction.options.getString('localização'),
            pronoun: interaction.options.getString('pronome'),
            gender: interaction.options.getString('gênero'),
            orientation: interaction.options.getString('orientação'),
            birthday: bday,

            card: {
              overlayOpacity: 0.6,
              levelColor: '#6e6e6e',
              rankColor: '#6e6e6e',
              progressBarColor: '#FFFFFF',
              backgroundType: 'IMAGE',
              background: 'https://i.imgur.com/0zdgXGO.png',
            },

            id: interaction.user.id,
            bdaynotified: null,
            verified: false,
            badges: ['2'],
            bannerURL: 'https://i.imgur.com/EbCa9W7.png',
            color: bot.config.color,
            createdAt: new Date(),
          };

          await bot.db.members.set(interaction.user.id, newData);

          return interaction
            .reply({
              content: `Perfil criado com sucesso! Qualquer dúvia contate o suporte.`,
            })
            .catch(() => {});
        }
        break;
    }
  },
};

function parseDate(str: string | null) {
  if (typeof str !== 'string') return null;
  function pad(x: any) {
    return (('' + x).length == 2 ? '' : '0') + x;
  }
  var m: any = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/),
    d = m ? new Date(m[3], m[2] - 1, m[1]) : null,
    matchesPadded = d && str == [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/'),
    matchesNonPadded = d && str == [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/');
  return matchesPadded || matchesNonPadded ? d : null;
}

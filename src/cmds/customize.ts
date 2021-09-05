import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';
import { hex_re, imgur_re } from '../utils/utils';

export const cmd: CommandOptions = {
  name: 'customize',
  devOnly: false,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let subcmd = interaction.options.getSubcommand() as 'profile' | 'card';
    let key = interaction.options.getString('key', true);
    let data = interaction.options.getString('data', true);

    let user = await bot.db.members.fetch(interaction.user.id);
    if (!user)
      return interaction
        .reply({
          content: `Você ainda não tem um perfil, crie um usando \`/profile create\``,
        })
        .catch(() => {});
    let eco = await bot.eco.fetch(interaction.user.id, interaction.guild?.id);
    if (!eco)
      return interaction
        .reply({
          content: `Não foi encontrado nenhum dado seu na economia.`,
        })
        .catch(() => {});

    let inventory = eco.inventory as unknown[] as string[];

    switch (subcmd) {
      case 'profile':
        {
          let nescessaryItems: { [key: string]: string } = {
            bannerURL: '883038166733451354',
            color: '883038238275682344',
          };

          let item = nescessaryItems[key];

          if (!inventory.includes(item))
            return interaction
              .reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(bot.config.color)
                    .setDescription(`Você deve comprar o item ${bot.eco.store.items.find((i) => i.id === item)?.name} para esta ação.`),
                ],
              })
              .catch(() => {});

          if (key === 'bannerURL') {
            if (!imgur_re.test(data))
              return interaction
                .reply({
                  embeds: [
                    new MessageEmbed()
                      .setColor(bot.config.color)
                      .setDescription(`A URL de banner deve seguir o formato padrão do Imgur.com! Ex.: https://i.imgur.com/PMUrGYU.png`),
                  ],
                })
                .catch(() => {});
          } else if (key === 'color') {
            if (!hex_re.test(data))
              return interaction
                .reply({
                  embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`A cor de perfil deve seguir o formato HEX Code! Ex.: #1c1c1c`)],
                })
                .catch(() => {});
          }

          await bot.db.members.set(`${interaction.user.id}.${key}`, data);

          interaction
            .reply({
              embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`Alteração efetuada com sucesso!`)],
            })
            .catch(() => {});
        }
        break;
      case 'card':
        {
          if (!inventory.includes('883461295091879946')) {
            return interaction
              .reply({
                embeds: [
                  new MessageEmbed()
                    .setColor(bot.config.color)
                    .setDescription(`Você deve comprar o item ${bot.eco.store.items.find((i) => i.id === '883461295091879946')?.name} para esta ação.`),
                ],
              })
              .catch(() => {});
          }

          if (key === 'card.overlayOpacity') {
            if (!(Number(data) >= 0.0 && Number(data) <= 1.0)) {
              return interaction
                .reply({
                  content: 'O opacidade da sobreposição deve ser entre 0.0 e 1.0',
                })
                .catch(() => {});
            }
          } else if (key === 'card.levelColor') {
            if (!hex_re.test(data)) {
              return interaction
                .reply({
                  content: 'A cor deve estar em formato HEX!Ex.: #1c1c1c',
                })
                .catch(() => {});
            }
          } else if (key === 'card.rankColor') {
            if (!hex_re.test(data)) {
              return interaction
                .reply({
                  content: 'A cor deve estar em formato HEX!Ex.: #1c1c1c',
                })
                .catch(() => {});
            }
          } else if (key === 'card.progressBarColor') {
            if (!hex_re.test(data)) {
              return interaction
                .reply({
                  content: 'A cor deve estar em formato HEX!Ex.: #1c1c1c',
                })
                .catch(() => {});
            }
          } else if (key === 'card.background') {
            if (hex_re.test(data)) {
              await bot.db.members.set(`${interaction.user.id}.card.backgroundType`, 'COLOR');
            } else if (imgur_re.test(data)) {
              await bot.db.members.set(`${interaction.user.id}.card.backgroundType`, 'IMAGE');
            } else {
              return interaction.reply({
                content: 'O plano de fundo deve estar em formato HEX de cor ou deve ser um link válido do Imgur!',
              });
            }
          } else {
            return;
          }

          await bot.db.members.set(`${interaction.user.id}.${key}`, data);

          interaction
            .reply({
              embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`Alteração efetuada com sucesso!`)],
            })
            .catch(() => {});
        }
        break;
    }
  },
};

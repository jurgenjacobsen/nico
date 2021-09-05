import { CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, User } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Fabric } from 'dsc.eco';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'fabric',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let user = interaction.options.getUser('membro', false) ?? interaction.user;
    let fabric = (await bot.eco.fabrics.fetch(interaction.user.id, interaction.guild?.id)) as Fabric;

    await update();

    let filter = (i: MessageComponentInteraction) => i.user.id === interaction.user.id;

    let collector = interaction.channel?.createMessageComponentCollector({ filter: filter, time: 10 * 60 * 1000 });

    collector?.on('collect', async (i) => {
      switch (i.customId) {
        case 'COLLECT_INCOME_FABRIC':
          {
            fabric?.collect().then(() => {
              update(i);
            });
            fabric = (await bot.eco.fabrics.fetch(interaction.user.id, interaction.guild?.id)) as Fabric;
          }
          break;
        case 'ADD_EMPLOYEES_FABRIC':
          {
            if (fabric.user.bank > 120 * fabric.level) {
              fabric?.hire().then(() => {
                update(i);
              });
              fabric = (await bot.eco.fabrics.fetch(interaction.user.id, interaction.guild?.id)) as Fabric;
            }
          }
          break;
        case 'PAY_FABRIC':
          {
            fabric?.pay().then(() => {
              update(i);
            });
            fabric = (await bot.eco.fabrics.fetch(interaction.user.id, interaction.guild?.id)) as Fabric;
          }
          break;
      }
    });

    async function update(i?: MessageComponentInteraction) {
      if (i) {
        if (i.deferred) {
          i.deferReply();
        } else {
          i.deferUpdate().catch(() => {});
        }
      }

      let data = await bot.eco.ensure(user.id, interaction.guild?.id);
      fabric = (await bot.eco.fabrics.fetch(user.id, interaction.guild?.id)) as Fabric;

      if (!fabric) {
        return interaction.reply({
          content: `Houve um erro ao encontrar a fábrica de ${user.toString()}`,
        });
      }

      let embed = new MessageEmbed()
        .setImage(`https://dema.city/assets/images/fabric/${fabric.level}.png`)
        .setColor(bot.config.color)
        .setAuthor(
          user.username,
          user.displayAvatarURL({
            dynamic: true,
            size: 128,
          }),
        )
        .addField('Nível', `${fabric.level}`, true)
        .addField('XP', `${fabric.xp}`, true)
        .addField(`Próximo Nível`, `${fabric.levelUpXP - fabric.xp}XP`, true)
        .addField(`Empregados`, `${fabric.employees}`, true)
        .addField(`Ganho estimado`, `$${fabric.receiveableMoney}/${fabric.level + 1}h`, true)
        .addField(`Status`, `${fabric.latePayment ? 'Pagamento atrasado' : 'Ok!'}`, true)
        .setFooter(`Você possue: $${Math.floor(data?.bank)} no banco | $${120 * fabric.level}/empregado`);

      let collect = new MessageButton().setCustomId('COLLECT_INCOME_FABRIC').setLabel('Coletar').setStyle('SUCCESS');
      let adde = new MessageButton().setCustomId('ADD_EMPLOYEES_FABRIC').setLabel('+Empregados').setStyle('PRIMARY');
      let pay = new MessageButton().setCustomId('PAY_FABRIC').setLabel('Pagar contas').setStyle('DANGER');

      if (!fabric.latePayment) pay.setDisabled(true);
      if (!fabric.collectable) collect.setDisabled(true);

      let row;

      let res: any = {
        embeds: [embed],
      };

      if (user.id === interaction.user.id) {
        row = new MessageActionRow();
        row.addComponents([collect, adde, pay]);
        res.components = [row as MessageActionRow];
      }

      if (interaction.replied) {
        interaction
          .editReply(res)
          .catch(() => {
            collector?.stop();
          })
          .catch(() => {});
      } else {
        interaction.reply(res).catch(() => {});
      }
    }
  },
};

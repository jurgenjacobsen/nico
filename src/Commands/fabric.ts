import { CommandInteraction, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, User } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Fabric } from 'dsc.eco';
import { Bot } from '../bot';

const images: { [key: number]: string } = {
  1: 'https://media.discordapp.net/attachments/859164889749389352/885187173979131924/1.png',
  2: 'https://media.discordapp.net/attachments/859164889749389352/885187174486667274/2.png',
  3: 'https://media.discordapp.net/attachments/859164889749389352/885187175635910686/3.png',
  4: 'https://media.discordapp.net/attachments/859164889749389352/885187176365715476/4.png',
  5: 'https://media.discordapp.net/attachments/859164889749389352/885187178278297702/5.png',
  6: 'https://media.discordapp.net/attachments/859164889749389352/885187180132188210/6.png',
};

let sell_row = new MessageActionRow().addComponents([
  new MessageButton().setStyle('DANGER').setCustomId('CONFIRM_SELL_FABRIC').setLabel('Confirmar'),
  new MessageButton().setStyle('SUCCESS').setCustomId('CANCEL_SELL_FABRIC').setLabel('Cancelar'),
]);

function fm(value: number) {
  return value.toLocaleString().replace(/,/g, '.');
}

export const cmd: CommandOptions = {
  name: 'fabric',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let user = interaction.options.getUser('membro', false) ?? interaction.user;
    let fabric: Fabric;

    await interaction.deferReply();

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
            await fabric?.hire();
            update(i);
            fabric = (await bot.eco.fabrics.fetch(interaction.user.id, interaction.guild?.id)) as Fabric;
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
        case 'SELL_FABRIC':
          {
            i.deferUpdate();
            (i.message as Message).edit({
              embeds: [
                new MessageEmbed().setColor(bot.config.color).setDescription(`
                Voc?? tem certeza que deseja vender sua f??brica por 5% do seu valuation equivalente a $${(fabric.valuation * 0.05)
                  .toLocaleString()
                  .replace(/,/g, '.')}? Voc?? ficar?? incapaz de coletar dinheiro da f??brica durante ${
                  fabric.sellTimeout
                } meses e dever?? continuar pagamento as contas da sua f??brica, se voc?? n??o pagar as contas ter?? de pagar uma multa por dia.
                `),
              ],
              components: [sell_row],
            });
          }
          break;
        case 'CONFIRM_SELL_FABRIC':
          {
            fabric.sell(5);
            update(i);
          }
          break;
        case 'CANCEL_SELL_FABRIC':
          {
            update(i);
          }
          break;
      }
    });

    async function update(i?: MessageComponentInteraction) {
      if (i) {
        if (i.deferred) {
          i.deferReply().catch(() => {});
        } else {
          i.deferUpdate().catch(() => {});
        }
      }

      fabric = await bot.eco.fabrics.ensure(user.id, interaction.guild?.id);

      if (!fabric) {
        return interaction.reply({
          content: `Houve um erro ao encontrar a f??brica de ${user.toString()}`,
        });
      }

      let embed = new MessageEmbed()
        .setImage(`${images[fabric.level]}`)
        .setColor(bot.config.color)
        .setAuthor(
          user.username,
          user.displayAvatarURL({
            dynamic: true,
            size: 128,
          }),
        )
        .addField('N??vel', `${fabric.level}`, true)
        .addField('XP', `${fabric.xp}`, true)
        .addField(`XP \`??????\``, `${fabric.levelUpXP}XP`, true)
        .addField(`Empregados`, `${fabric.employees}/${20 * fabric.level}`, true)
        .addField(`Ganho estimado`, `$${fabric.receiveableMoney}/${fabric.level + 1}h`, true)
        .addField(`Valuation`, `$${fabric.valuation.toLocaleString().replace(/,/g, '.')}`, true)
        .addField(`Vendido`, `${fabric.sold ? fabric.sold + '%' : 'N??o'}`, true)
        .addField(`Status`, `${fabric.latePayment ? 'Pagamento atrasado' : 'Ok!'}`, true)

        .setFooter(
          `Voc?? possue: $${fm(Math.floor(fabric.user.bank))} no banco | $${fabric.employeePrice}/empregado ${
            fabric.latePayment ? `| $${fm(fabric.valueToPay)} ?? pagar` : ''
          }`,
        );

      let collect = new MessageButton().setCustomId('COLLECT_INCOME_FABRIC').setLabel('Coletar').setStyle('SUCCESS');
      let adde = new MessageButton().setCustomId('ADD_EMPLOYEES_FABRIC').setLabel('Empregados').setStyle('PRIMARY');
      let pay = new MessageButton().setCustomId('PAY_FABRIC').setLabel('Pagar').setStyle('DANGER');
      let sell = new MessageButton().setCustomId('SELL_FABRIC').setLabel('Vender').setStyle('DANGER');

      if (!fabric.latePayment) pay.setDisabled(true);
      if (fabric.employees >= fabric.level * 20) adde.setDisabled(true);
      if (!fabric.collectable || fabric.latePayment) collect.setDisabled(true);
      if (fabric.level < 5) sell.setDisabled(true);

      let row;

      let res: any = {
        embeds: [embed],
      };

      if (user.id === interaction.user.id) {
        row = new MessageActionRow();
        row.addComponents([collect, adde, pay, sell]);
        res.components = [row as MessageActionRow];
      }

      if (interaction.replied || interaction.deferred) {
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

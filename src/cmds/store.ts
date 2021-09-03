import { CommandInteraction, TextChannel } from "discord.js";
import { CommandOptions } from "dsc.cmds";
import { Bot } from "../bot";
import { hex_re, imgur_re } from "../utils/utils";

export const cmd: CommandOptions = {
  name: 'store',
  run: async (bot: Bot, interacion: CommandInteraction) => {
    let sub = interacion.options.getSubcommand() as 'publish'

    switch(sub) {
      case 'publish': {
        let id = interacion.options.getString('id', true);
        let color = interacion.options.getString('cor', true);
        let banner = interacion.options.getString('banner', false);

        if(!bot.eco.store.items.find((i) => i.id === id)) {
          return interacion.reply({
            content: `Item não existente.`,
          });
        }

        if(!hex_re.test(color)) {
          return interacion.reply({
            content: `Cor não está no formato HEX!`,
          });
        }

        if(banner && !imgur_re.test(banner)) {
          return interacion.reply({
            content: `O banner provido não é do Imgur!`,
          });
        }

        let response = await bot.eco.store.publish(id, {
          labels: {
            price: 'Valor',
            buy: 'Comprar'
          },
          color: color as any,
          banner: banner ?? undefined,
        });

        if(!response) {
          return interacion.reply({
            content: 'Houve um erro ao executar esta ação!',
          })
        }

        let channel = interacion.guild?.channels.cache.get(bot.config.storeChannel);

        if(channel instanceof TextChannel) {
          channel.send(response).catch(() => {});
          
          interacion.reply({
            content: `Sucesso!`,
          }).catch(() => { })
        }
      };
      break;
    }
  }
}
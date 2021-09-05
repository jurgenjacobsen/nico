import { CommandInteraction, MessageEmbed } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'config',
  devOnly: false,
  guildOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let subcommand = interaction.options.getSubcommand() as 'add' | 'remove' | 'show';
    let channel = interaction.options.getChannel('canal', false);
    let role = interaction.options.getRole('cargo', false);
    let data = channel?.id ? channel.id : role?.id ? role.id : null;

    let key = interaction.options.getString('key', false) as CONFIG_KEYS;

    switch (subcommand) {
      case 'show':
        {
          let config = bot.config;
          let embed = new MessageEmbed().setColor(bot.config.color).setDescription(`
          \n
          Cargos que serão dados ao usuário quando um membro entrar em call
          ${config.vcRoles.map((x) => `<@&${x}>`).join(`, `)}

          Canais de voz que darão cargos de call ao entrar
          ${config.vcRoleChannels.map((x) => `<#${x}>`).join(`, `)}

          Categorias que darão cargos de call
          ${config.vcRolesCats.map((x) => `<#${x}>`).join(`, `)}

          Cargos que serão adicionados quando o membro entrar em um canal de evento
          ${config.eventRoles.map((x) => `<@&${x}>`).join(`, `)}

          Canais de evento
          ${config.eventChannels.map((x) => `<#${x}>`).join(`, `)}

          Canais que é permitido receber XP
          ${config.allowedXPChannels.map((x) => `<#${x}>`).join(`, `)}

          Categorias que é permitido ao usuário receber XP
          ${config.allowedXPCats.map((x) => `<#${x}>`).join(`, `)}

          Canais que é permitido contar estatísticas para o usuário
          ${config.allowedStatsChannels.map((x) => `<#${x}>`).join(`, `)}

          Categorias que é permitido contar estatísticas para o usuário
          ${config.allowedStatsCats.map((x) => `<#${x}>`).join(`, `)}

          Cargos que receberão o dobro de XP
          ${config.DXPRoles.map((x) => `<@&${x}>`).join(`, `)}

          Canais que receberão o dobro de XP
          ${config.DXPChannels.map((x) => `<#${x}>`).join(`, `)}
          `);

          return interaction
            .reply({
              embeds: [embed],
            })
            .catch((err) => {});
        }
        break;

      case 'add':
        {
          if (!data || !key || !bot.user) return interaction.reply({ content: 'NC 001 | Houve um erro por falta de dados' }).catch((err) => {});
          await bot.db.this.push(`${bot.user.id as string}.${key}`, data);
        }
        break;

      case 'remove':
        {
          if (!data || !key || !bot.user) return interaction.reply({ content: 'NC 002 | Houve um erro por falta de dados' }).catch((err) => {});
          await bot.db.this.pull(`${bot.user.id as string}.${key}`, data);
        }
        break;
    }

    bot.configManager.update();

    return interaction.reply({ content: 'Alterações salvas com sucesso! Use `/config show`' }).catch((err) => {});
  },
};

type CONFIG_KEYS =
  | 'vcRoles'
  | 'vcRoleChannels'
  | 'vcRolesCats'
  | 'eventRoles'
  | 'eventChannels'
  | 'allowedXPChannels'
  | 'allowedStatsChannels'
  | 'allowedStatsCats'
  | 'allowedXPCats'
  | 'DXPRoles'
  | 'DXPChannels';

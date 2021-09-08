import { GuildMember, Interaction, Message, MessageEmbed, TextChannel } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';
import { print } from '../utils/utils';

const like_reg = /\d?\d?\d?\d[ 👍]/g;

export const event: EventOptions = {
  name: 'interactionCreate',
  once: false,
  run: async (bot: Bot, interaction: Interaction) => {
    if (interaction.isCommand()) {
      bot.stats.users.update(interaction.user.id, 'commands', 1);

      if (interaction.guild) {
        bot.stats.guild.update(interaction.guild.id as string, 'commands', 1);
      }

      print(`${interaction.user.tag} usou o comando /${interaction.commandName} em #${(interaction.channel as TextChannel).name}`);
    } else if (interaction.isButton()) {
      if (!interaction.channel) return;
      if (!interaction.guild) return;

      let rawId = interaction.customId;

      if (rawId.startsWith(`ITEM_`) && rawId.endsWith(`_BUY`) && bot.config.storeChannel === interaction.channel.id) {
        let id = rawId.replace(`ITEM_`, '').replace(`_BUY`, ``).trim();
        bot.eco.store
          .buy(id, interaction.user.id, interaction.guild.id)
          .then((res) => {
            if (res.err && res.err === 'NOT_ENOUGH_MONEY') {
              return interaction.reply({
                ephemeral: true,
                content: '💳 | Você não tem dinheiro suficiente!',
              });
            }
            return interaction.reply({
              ephemeral: true,
              content: '💳 | Compra efetuada com sucesso!',
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (rawId.startsWith('LIKE_SONG_')) {
        if(interaction.guild?.me?.voice.channelId && (interaction.member as GuildMember).voice.channelId !== interaction.guild.me.voice.channelId) return print(`${interaction.user.tag} tentou curtir uma música mas não esta escutando música com o Nico.`);
        let id = rawId.replace('LIKE_SONG_', '').trim();
        let sotw = await bot.db.sotw.fetch(id);
        if (!sotw) return print(`${interaction.user.tag} tentativa de curtida errônea, música não encontrada!`);
        if (sotw.data.likes.includes(interaction.user.id)) return print(`${interaction.user.tag} já curtiu esta música. [${id}]`);
        interaction.deferUpdate();
        bot.db.sotw.push(`${id}.likes`, interaction.user.id);
        let old = interaction.message.embeds[0] as MessageEmbed;
        let oldLikes = (old.description as string).match(like_reg) as string[];
        let embed = new MessageEmbed(old).setDescription(`
        ${old.description?.replace(oldLikes[0] + '👍', `${Number(oldLikes[0]) + 1} 👍`)}
        `);
        (interaction.message as Message).edit({
          embeds: [embed]
        })
      }

      if(rawId.startsWith(`ADD_SOTW_`)) {
        let id = rawId.replace('ADD_SOTW_', '').trim();
        let sotw = await bot.db.sotw.fetch(id);
        if(sotw) return;

        let footer = interaction.message.embeds[0].footer?.text;
        if(!footer) return;
        
        let track = await bot.player.search(footer, { requestedBy: interaction.user.id }).then((response) => response.tracks[0]);
        if(!track) return;

        await bot.db.sotw.set(id, {
          id: id,
          name: track.title,
          url: track.url,
          played: 0,
          lastPlay: new Date('January 1, 2000'),
          likes: [],
          addedAt: new Date(),
        });

        interaction.deferUpdate();
        interaction.followUp({
          content: `Esta música foi adicionada à lista de músicas da semana!`,
        });
      }
    }
  },
};

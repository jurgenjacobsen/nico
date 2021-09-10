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
        return;
      }

      if (rawId.startsWith('LIKE_SONG_')) {
        if (interaction.guild?.me?.voice.channelId && (interaction.member as GuildMember).voice.channelId !== interaction.guild.me.voice.channelId)
          return print(`${interaction.user.tag} tentou curtir uma música mas não esta escutando música com o Nico.`);
        let id = rawId.replace('LIKE_SONG_', '').trim();
        let sotw = await bot.db.sotw.fetch(id).then(data => data?.data);
        if (!sotw) return print(`${interaction.user.tag} tentativa de curtida errônea, música não encontrada!`);

        let old = interaction.message.embeds[0] as MessageEmbed;
        let oldLikes = (old.description as string).match(like_reg) as string[];
        interaction.deferUpdate();

        if(!sotw.likes.includes(interaction.user.id)) {
          await bot.db.sotw.push(`${id}.likes`, interaction.user.id);
          let embed = new MessageEmbed(old).setDescription(`
          ${old.description?.replace(oldLikes[0] + '👍', `${Number(oldLikes[0]) + 1} 👍`)}
          `);
          (interaction.message as Message).edit({
            embeds: [embed],
          });
        } else {
          await bot.db.sotw.pull(`${id}.likes`, interaction.user.id);
          let embed = new MessageEmbed(old).setDescription(`
          ${old.description?.replace(oldLikes[0] + '👍', `${Number(oldLikes[0]) - 1} 👍`)}
          `);
          (interaction.message as Message).edit({
            embeds: [embed],
          });
        }
        return;
      }

      if (rawId.startsWith('DISLIKE_SONG_')) {
        if (interaction.guild?.me?.voice.channelId && (interaction.member as GuildMember).voice.channelId !== interaction.guild.me.voice.channelId)
          return print(`${interaction.user.tag} tentou descurtir uma música mas não esta escutando música com o Nico.`);
        let id = rawId.replace('DISLIKE_SONG_', '').trim();
        let sotw = await bot.db.sotw.fetch(id).then(data => data?.data);
        if (!sotw) return print(`${interaction.user.tag} tentativa de curtida errônea, música não encontrada!`);
        interaction.deferUpdate();
        
        if(!sotw.dislikes) return await bot.db.sotw.set(`${id}.dislikes`, [interaction.user.id]);

        if(!sotw.dislikes.includes(interaction.user.id)) {
          bot.db.sotw.push(`${id}.dislikes`, interaction.user.id);
        } else {
          bot.db.sotw.pull(`${id}.dislikes`, interaction.user.id);
        }
        return;
      }

      if(rawId.startsWith('FAVORITE_SONG_')) {
        if (interaction.guild?.me?.voice.channelId && (interaction.member as GuildMember).voice.channelId !== interaction.guild.me.voice.channelId)
          return print(`${interaction.user.tag} tentou descurtir uma música mas não esta escutando música com o Nico.`);
        let id = rawId.replace('FAVORITE_SONG_', '').trim();
        let sotw = await bot.db.sotw.fetch(id).then(data => data?.data);

        if (!sotw) return print(`${interaction.user.tag} tentativa de curtida errônea, música não encontrada!`);

        let user = await bot.db.members.fetch(interaction.user.id).then((data) => data?.data);
        interaction.deferUpdate();

        if(!user) return interaction.followUp({
          content: `Você deve criar uma perfil antes de favoritar uma música! Use o comando \`/profile create\``,
          ephemeral: true,
        });

        if(!sotw.favorites) return await bot.db.sotw.set(`${id}.favorites`, [interaction.user.id]);
        if(!Array.isArray(user.favorites)) return await bot.db.members.set(`${interaction.user.id}.favorites`, [id]);

        if(!sotw.favorites.includes(interaction.user.id)) {
          bot.db.sotw.push(`${id}.favorites`, interaction.user.id);
        } else {
          bot.db.sotw.pull(`${id}.favorites`, interaction.user.id);
        }

        if(!user.favorites.includes(id)) {
          bot.db.members.push(`${interaction.user.id}.favorites`, id);
        } else {
          bot.db.members.pull(`${interaction.user.id}.favorites`, id);
        }
        return;
      }

      if(rawId === 'SKIP_SOUND') {
        if(interaction.guild?.me?.voice.channelId && (interaction.member as GuildMember).voice.channelId !== interaction.guild.me.voice.channelId) return;
        let msg = await interaction.channel.messages.fetch(interaction.message.id);
        let queue = bot.player.getQueue(interaction.guild.id);
        if(!queue.playing) return;
        await interaction.deferUpdate();
        try {
          if(msg.deletable) msg.delete();
          queue.skip();
        } catch {}
        return;
      }

      if (rawId.startsWith(`ADD_SOTW_`)) {
        let id = rawId.replace('ADD_SOTW_', '').trim();
        let sotw = await bot.db.sotw.fetch(id);
        if (sotw) return;

        let footer = interaction.message.embeds[0].footer?.text;
        if (!footer) return;

        let track = await bot.player.search(footer, { requestedBy: interaction.user.id }).then((response) => response.tracks[0]);
        if (!track) return;

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

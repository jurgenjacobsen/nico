import { GuildMember, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';
import { print } from '../Utils/utils';

export const event: EventOptions = {
  name: 'messageReactionAdd',
  once: false,
  run: async (bot: Bot, reaction: MessageReaction, user: User) => {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message: ', error);
        return;
      }
    }

    if (bot.config.suggestion.channelIds.includes(reaction.message.channelId)) {
      if (reaction.emoji.id === bot.config.suggestion.approve) {
        let member = reaction.message.guild?.members.cache.get(user.id);
        if (!member || !bot.config.suggestion.perms.includes(member.roles.highest.id)) return print(`${user.tag} tentou aprovar uma sugestão!`);

        reaction.message.edit({
          embeds: [new MessageEmbed(reaction.message.embeds[0]).setColor('#EE88AF').setFooter('Aprovado por ' + user.tag)],
        });

        reaction.remove();

        print('Sugestão aprovada!');
      }
    }

    if(reaction.emoji.name === '⭐' && !reaction.me) {
      if(reaction.count === 1) {
        let member = await bot.eco.ensure(user.id, reaction.message.guild?.id);
        if(member.bank >= bot.config.starboard.price) {
          await bot.eco.removeMoney(bot.config.starboard.price, user.id, reaction.message.guild?.id);
        } else {
          return reaction.remove();
        }
      } 
      
      if(reaction.count >= bot.config.starboard.starCount) {
        let starboard = bot.channels.cache.get(bot.config.starboard.channelId) as TextChannel;
        if(!starboard) return;

        let imageURL = reaction.message.attachments.first()?.url;

        let message = reaction.message;
        let author = reaction.message.author as User;
        let member = reaction.message.guild?.members.cache.get(reaction.message.author?.id as string) as GuildMember;

        let reactions = await reaction.users.fetch();

        let embed = new MessageEmbed()
        .setColor(bot.config.color)
        .setImage(imageURL ? imageURL : '')
        .setAuthor(member.nickname ? member.nickname : author.username, author.displayAvatarURL({ dynamic: true, size: 256 }))
        .addField(`Comprador`, reactions.first()?.toString() ?? 'ㅤ')

        .setTimestamp(message.createdAt)

        if(message.content) {
          embed.setDescription(message.content);
        }
        
        let msg = await starboard.send({
          embeds: [embed]
        });

        msg.react('⭐');
      }
    }

    if(reaction.message.channel.id === bot.config.starboard.channelId) {
      let embed = new MessageEmbed(reaction.message.embeds[0]);

      embed.setFooter(`${reaction.count} ⭐`);

      reaction.message.edit({
        embeds: [embed]
      })
    }
  },
};

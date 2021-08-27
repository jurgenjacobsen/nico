import { MessageEmbed, MessageReaction, User } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { print } from "../utils/utils";

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
    
    if(bot.config.suggestion.channelIds.includes(reaction.message.channelId)) {
      if(reaction.emoji.id === bot.config.suggestion.approve) {
        let member = reaction.message.guild?.members.cache.get(user.id);
        if(!member || !bot.config.suggestion.perms.includes(member.roles.highest.id)) 
        return print(`${user.tag} tentou aprovar uma sugestão!`);

        reaction.message.edit({
          embeds: [
            new MessageEmbed(reaction.message.embeds[0])
            .setColor('#EE88AF')
            .setFooter('Aprovado por ' + user.tag),
          ]
        });

        reaction.remove();
      };
    }
  }
}
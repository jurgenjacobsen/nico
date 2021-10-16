import { MessageEmbed, MessageReaction } from "discord.js";
import { User } from "dsc.eco";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";

export const event: EventOptions = {
  name: 'messageReactionRemove',
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


    if (reaction.message.channel.id === bot.config.starboard.channelId) {
      let embed = new MessageEmbed(reaction.message.embeds[0]);

      embed.setFooter(`${reaction.count} ⭐`);

      reaction.message.edit({
        embeds: [embed],
      }).catch(err => { });
    }
  },
};
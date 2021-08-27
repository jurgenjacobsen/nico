import { Message, MessageEmbed } from "discord.js";
import { EventOptions } from "dsc.events";
import { Util } from "dsc.levels";
import { Bot } from "../bot";
import { AntiInvite, suggestion } from "../utils";

let cmdregex = /^[%*!?$-+]/;
let cooldowns = new Set();

export const event: EventOptions = {
  name: 'messageCreate',
  once: false,
  run: (bot: Bot, message: Message) => {

    /** Checks if the author is a bot and if the message was sent inside a guild or not */
    if(message.author.bot) return;
    if(!message.guild || !message.member) return;

    /** Checks if the message content has any kind of not allowed discord invite */
    AntiInvite(bot, message);

    /** If in a suggestion channel it'll format the message as a suggestion */
    if(bot.config.suggestionChannels.includes(message.channelId)) {
      suggestion(bot, message);
    }
    
    /** 
     * Adds XP and a random small amount of money to the user
     * */
    if(bot.config.text.allowedXPChannels.includes(message.channelId) && !cmdregex.test(message.content)) {
      let ckey = `MSG_${message.author.id}`;
      cooldowns.add(ckey);
      if(!cooldowns.has(ckey)) {
        let xp = Math.floor(Util.random(15,25));
        if(bot.config.text.DXPChannels.includes(message.channelId)) {
          xp = xp * 2;
        } else if(message.member.roles.cache.find((r) => bot.config.text.DXPRoles.includes(r.id))) {
          xp = xp * 2;
        };
        bot.levels.update(message.author.id, 'TEXT', xp, message.guild.id, (user) => {
          message.channel.send({
            embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`🎉 | Você subiu para o nível **${user.textLevel}**!`)],
            reply: { messageReference: message },
          });
        });
        bot.eco.addMoney(Math.floor(Util.random(1, 5)), message.author.id, message.guild.id);
        setTimeout(() => cooldowns.delete(ckey), 60 * 1000);
      };
    };


  }
}
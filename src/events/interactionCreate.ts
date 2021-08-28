import { Interaction } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";

export const event: EventOptions = {
  name: 'interactionCreate',
  once: false,
  run: (bot: Bot, interaction: Interaction) => {

    if(interaction.isCommand()) {
      bot.stats.users.update(interaction.user.id, 'commands', 1);
    }

  }
}
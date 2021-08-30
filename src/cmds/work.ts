import { CommandInteraction } from "discord.js";
import { CommandOptions } from "dsc.cmds";
import { Bot } from "../bot";

export const cmd: CommandOptions = {
  name: 'work',
  devOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    console.log(interaction)
  }
}
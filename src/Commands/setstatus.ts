import { CommandInteraction, MessageEmbed, PresenceStatusData } from 'discord.js';
import { CommandOptions } from 'dsc.cmds';
import { Bot } from '../bot';

export const cmd: CommandOptions = {
  name: 'setstatus',
  devOnly: false,
  guildOnly: false,
  run: async (bot: Bot, interaction: CommandInteraction) => {

    let old = await bot.db.this.fetch(`${bot.user?.id}`).then((data) => data?.data);

    let status = interaction.options.getString('status') as 'DND' | 'IDLE' | 'ONLINE' | undefined;
    let playing = interaction.options.getString('playing');

    bot.user?.setPresence({
      status: status as any,
      activities: [
        {
          name: playing ?? old.playingStatus as string
        }
      ]
    });

    await bot.db.this.set(`${bot.user?.id}.statusType`, status);
    await bot.db.this.set(`${bot.user?.id}.playingStatus`, playing);

    return interaction.reply({
      content: 'Ok!',
    });
  },
};

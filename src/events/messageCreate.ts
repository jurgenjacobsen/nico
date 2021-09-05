import discordjs, { Message, MessageEmbed, Collection } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Util } from 'dsc.levels';
import { Bot } from '../bot';
import { data } from '../utils/Structures/commands';
import { AntiInvite, print, suggestion } from '../utils/utils';

let cmdregex = /^[%*!?$-+.]/;
let cooldowns = new Set();

let frenscache = new Collection<
  string,
  {
    userId: string;
    tag: string;
    media: {
      msgs: number;
      voice: number;
    };
    checks: {
      msgs: boolean;
      voice: boolean;
    };
  }
>();

export const event: EventOptions = {
  name: 'messageCreate',
  once: false,
  run: async (bot: Bot, message: Message) => {
    /**
     * Checks if the author is a bot and if the message was sent inside a guild or not
     */
    if (message.author.bot) return;

    if (message.author.id === '404253084584378389' && message.channel.id === '714634320115138621') {
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1 > 9 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`;
      let day = today.getDate() > 9 ? today.getDate() : `0${today.getDate()}`;

      message.startThread({
        name: `${day}-${month}-${year}`,
        autoArchiveDuration: 'MAX',
      });
    }

    if (!message.guild || !message.member) return;

    let channel = await message.guild.channels.fetch(message.channelId);
    let category = channel?.parent;

    /**
     *  Checks if the message content has any kind of not allowed discord invite
     */
    AntiInvite(bot, message);

    /** If in a suggestion channel it'll format the message as a suggestion */
    if (bot.config.suggestion.channelIds.includes(message.channelId)) {
      suggestion(bot, message);
    }

    let voiceState = message.guild.voiceStates.cache.get(message.author.id);

    /**
     * Adds XP and a random small amount of money to the user
     */
    if (
      (bot.config.allowedXPChannels.includes(message.channelId) || bot.config.allowedXPCats.includes(category?.id as string)) &&
      !cmdregex.test(message.content) &&
      (voiceState ? voiceState.selfMute : true)
    ) {
      let ckey = `MSG_${message.author.id}`;
      if (!cooldowns.has(ckey)) {
        cooldowns.add(ckey);
        let xp = Math.floor(Util.random(10, 20));
        if (bot.config.DXPChannels.includes(message.channelId)) {
          xp = xp * 2;
        } else if (message.member.roles.cache.find((r) => bot.config.DXPRoles.includes(r.id))) {
          xp = xp * 2;
        }
        bot.levels.update(message.author.id, 'TEXT', xp, message.guild.id, (user) => {
          message.channel
            .send({
              embeds: [new MessageEmbed().setColor(bot.config.color).setDescription(`🎉 | Você subiu para o nível **${user.textLevel}**!`)],
              reply: { messageReference: message },
            })
            .then((m) => {
              setTimeout(() => {
                if (m.deletable) m.delete();
              }, 10000);
            })
            .catch((err) => {
              console.log(err);
            });
        });
        bot.eco.addMoney(Math.floor(Util.random(1, 5)), message.author.id, message.guild.id);
        setTimeout(() => cooldowns.delete(ckey), 60 * 1000);
      }
    }

    /**
     *  Adds stats to the user
     */
    if (bot.config.allowedStatsChannels.includes(message.channelId) || bot.config.allowedStatsCats.includes(category?.id as string)) {
      if (cmdregex.test(message.content)) {
        bot.stats.users.update(message.author.id, 'commands', 1);
      } else {
        bot.stats.users.update(message.author.id, 'messages', 1);
      }
    }

    /**
     * Adds stats to the guild
     */
    if (cmdregex.test(message.content)) {
      bot.stats.guild.update(message.guild.id, 'commands', 1);
    } else {
      bot.stats.guild.update(message.guild.id, 'messages', 1);
    }

    /**
     * The bot will answer or react to the message when he's mentioned, just for fun. :D
     */
    if (message.mentions.members?.has(bot.user?.id as string) || message.content.toLowerCase().includes(' nico ') || message.content.toLowerCase() === 'nico') {
      message.react(`👀`);
    }

    /**
     * Slash commands manager - Provisory way to manage bot's commands
     */
    if (message.content.startsWith('+update') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+update ', '').trim();
      let cmds = await message.guild.commands.fetch();

      let cmd = cmds.find((c) => c.name === comando);
      let cmd_data = data.find((c) => c.name === comando);
      if (!cmd_data) return;
      cmd?.edit(cmd_data);
    }

    if (message.content.startsWith('+create') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+create ', '').trim();
      let cmd_data = data.find((c) => c.name === comando);
      if (!cmd_data) return print('Comando não encontrado nos dados locais!');
      let cmds = await message.guild.commands.fetch();
      let cmd = cmds.find((c) => c.name === comando);
      if (cmd) return print('Comando já existente!');
      message.guild.commands.create(cmd_data);
    }

    if (message.content.startsWith('+delete') && bot.config.devs.ids.includes(message.author.id)) {
      let comando = message.content.replace('+delete ', '').trim();
      let cmds = await message.guild.commands.fetch();

      let cmd = cmds.find((c) => c.name === comando);
      cmd?.delete();
    }

    if (message.content.startsWith('+perms') && bot.config.devs.ids.includes(message.author.id)) {
      /*let comando = 'reroll';
      let cmds = await message.guild.commands.fetch()
      let cmd = cmds.find((c) => c.name === comando)

      cmd?.permissions.set({
        permissions: [
          {
            type: 'ROLE',
            id: '739183741515071539',
            permission: true,
          }, 
          {
            type: 'ROLE',
            id: '709450575640789083',
            permission: true,
          }
        ]
      })*/
    }

    /*if(message.content === '+pub') {
      let payload = await bot.eco.store.publish('883038238275682344', {
        labels: {
          buy: 'Comprar',
          price: 'Preço'
        },
        color: bot.config.color,
      })

      let channel = message.guild.channels.cache.get('852216501046214696') as TextChannel;
      if(!payload) return;
      channel.send(payload)
    }*/

    if (message.content === '+frenslist' && (message.member.roles.cache.has('739183741515071539') || message.member.roles.cache.has('709450575640789083'))) {
      let msg = await message.channel.send({
        content: `Carregando... (${frenscache.size})`,
      })

      let pos = 1;
      let content = `
        ${frenscache
          .map((f) => {
            let voice = String(f.media.voice).includes(`.`)
              ? String(f.media.voice).split('.')[0] + '.' + String(f.media.voice).split('.')[1].slice(0, 1)
              : f.media.voice;

            return `**${pos++}.** \` ${f.userId}\` | **${f.tag}** | MSGS ${f.media.msgs}/dia | VOZ ${voice}hr`;
          })
          .join('\n')}
      `;

      let blocks = discordjs.Util.splitMessage(content);

      msg.edit({
        content: `${blocks[0]}\nㅤ`,
      });

      if (blocks.length > 1) {
        blocks.slice(1).forEach((b) => {
          msg.reply({
            content: `${b}`,
          });
        });
      }
    }

    if (message.content === '+frensload' && (message.member.roles.cache.has('739183741515071539') || message.member.roles.cache.has('709450575640789083'))) {
      let members = message.guild.members.cache.filter((m) => new Date().getTime() - (m.joinedAt as Date).getTime() >= 3 * 30 * 24 * 60 * 60 * 1000);

      message.channel.send({
        content: `Carregando...`,
      })

      members.forEach(async (m) => {
        let stats = await bot.stats.users.graphicFormatData(m.id, 15);
        if (stats) {
          let requirements = {
            messages: 60,
            voice: 2.5,
          };

          let medias = {
            messages: stats.messages.reduce((a, b) => a + b) / 15,
            voice: stats.voice.reduce((a, b) => a + b) / 60,
          };

          if (medias.messages > requirements.messages || medias.voice > requirements.voice) {
            frenscache.set(m.id, {
              userId: m.id,
              tag: m.user.tag,
              media: {
                msgs: Math.floor(medias.messages),
                voice: medias.voice,
              },
              checks: {
                msgs: medias.messages > requirements.messages,
                voice: medias.voice > requirements.voice,
              },
            });
          } else {
            frenscache.delete(m.id)
          }
        }
      });
    }

    if (message.content === '+test') {
      
    }
  },
};

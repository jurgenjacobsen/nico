import { GuildMember, MessageAttachment, TextChannel } from "discord.js";
import { EventOptions } from "dsc.events";
import { Bot } from "../bot";
import { DrawCard } from "../utils/card";
import { MemberCounter, print } from "../utils/utils";

export const event: EventOptions = {
  name: 'guildMemberAdd',
  once: false,
  run: async (bot: Bot, member: GuildMember) => {
    let guild = member.guild;
    let memberCount = guild.memberCount || guild.members.cache.size;

    let welcomeChannel = member.guild.channels.cache.get(bot.config.welcomeChannel) as TextChannel;
    let welcomeText = `Seja bem-vinde ${member} ao **Clique Brasil**!\n\n**Aqui estão alguns canais para você se informar**\n> <#727641717188198523> - *Obtenha informações básicas sobre nossa comunidade.*\n> <#503288296743632896> - *Fique por dentro das regras.*\n> <#466068493142458370> e <#698246223420850227> - *São os principais chats para você interagir no servidor!*\nㅤ`;

    let WelcomeCardBuffer = await DrawCard({
      avatar: member.user.displayAvatarURL({ format: 'png', size: 256 }),
      rounded: true,
      theme: `dark`,
      title: `Bem-vinde!`,
      subtitle: `Membro # ${memberCount}`,
      text: `${member.user.username}`,
    });

    welcomeChannel.send({
      content: welcomeText,
      files: [new MessageAttachment(WelcomeCardBuffer, `${member.id}.png`)]
    });

    MemberCounter(bot, member.guild);

    print(`Novo membro ${member.user.tag}!`);
  }
}
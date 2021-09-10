import { Guild, Collection, Invite, TextChannel, MessageEmbed } from 'discord.js';
import { Bot } from '../../bot';

export type InvitesCache = Collection<string, Invite>;

export class InvitesManager {
  public cache: InvitesCache;
  public guild!: Guild;
  public channel!: TextChannel;
  constructor(bot: Bot) {

    this.cache = new Collection();

    bot.on('ready', async () => {
      let guild = bot.guilds.cache.get(bot.config.guild);
      if(!guild) return;
      let channel = bot.channels.cache.get(bot.config.logs.tracker) as TextChannel;
      if(!channel) return;

      this.guild = guild;
      this.channel = channel;

      let invites = await guild.invites.fetch().then((res) => res).catch((err) => console.log(err));
      if(!invites) return;

      this.cache = invites;
    });

    bot.on('inviteCreate', (invite) => {
      this.cache.set(invite.code, invite);
    });

    bot.on('inviteDelete', (invite) => {
      this.cache.delete(invite.code);
    });

    bot.on('guildMemberAdd', async (member) => {
      
      let isFake = (new Date().getTime() - member.user.createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 3 ? true : false;

      let invites = await this.guild.invites.fetch().then((res) => res).catch((err) => console.log(err));
      if(!invites) return;

      let invite = invites.find(_i => this.cache.has(_i.code) && (this.cache.get(_i.code)?.uses ?? 0) < (_i.uses ?? 0)) || this.cache.find(_i => !invites?.has(_i.code)) || this.guild.vanityURLCode;

      this.cache = invites;

      let embed = new MessageEmbed().setColor(bot.config.color).setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true, size: 256 }));

      if (typeof invite !== 'string' && invite && invite.inviter) {
        
        embed.addField('Código de Convite', invite.code);
        embed.addField('Usos', `${invite.uses ?? 0}${`${invite.maxUses ? `/${invite.maxUses}` : ''}`}`);
        embed.addField('Convite criado por', `${invite.inviter.toString()}`);
        embed.addField('Conta', `${isFake ? 'Considerada *fake*' : 'Regular'}`)

      } else if(invite === this.guild.vanityURLCode) {

        embed.setDescription('Entrou utilizando o convite padrão do servidor.');
        embed.addField('Conta', `${isFake ? 'Considerada *fake*' : 'Regular'}`);
        embed.addField('Usos', `${this.guild.vanityURLUses ?? 0}`);

      } else {

        embed.setDescription('Convite não encontrado ou desconhecido.');

      }

      this.channel.send({
        embeds: [ embed ],
      }).catch((err) => console.log(err));

    });
  }
}
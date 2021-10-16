import { GuildChannel, Collection, ThreadChannel } from 'discord.js';
import { EventOptions } from 'dsc.events';
import { Bot } from '../bot';

export const GeneralsChannelsCache: Collection<string, string> = new Collection();

export const event: EventOptions = {
  name: 'channelCreate',
  once: false,
  run: async (bot: Bot, channel: GuildChannel) => {
    if (!channel.guild) return;

    const AuditLogsFetch = await channel.guild.fetchAuditLogs({ limit: 1, type: 'CHANNEL_CREATE' });
    const Entry = AuditLogsFetch.entries.first();
    if (!Entry) return;

    if (Entry.executor?.id === '159985870458322944') {
      if (channel.type !== 'GUILD_VOICE') return;
      if (channel.parent?.id !== '698244358796869682') return;

      let name;

      if (GeneralsChannelsCache.size < 1) {
        let channels = channel.guild.channels.cache.filter((ch) => ch.name.toLowerCase().includes('geral')).sort((a, b) => nn(a) - nn(b));

        let last = channels.last();
        if (last) name = `Geral #${nn(last) + 1}`;
      }

      if (!name) name = `Geral #${GeneralsChannelsCache.size + 1}`;

      channel.setName(name).catch((err) => console.log(err));

      GeneralsChannelsCache.set(channel.id, channel.id);
    }
  },
};

function nn(channel: GuildChannel | ThreadChannel): number {
  return Number(channel.name.toLowerCase().replace('geral ', '').trim());
}

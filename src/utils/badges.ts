import { EmojiResolvable } from "discord.js";

export const badges = {
  LIST: [
    {
      name: 'Developer',
      description: '',
      date: new Date('August 28, 2021'),
      emoji: '<:dev:853033685750382592>',
      id: '1',
    },
    {
      name: 'Bughunter',
      description: '',
      date: new Date('August 28, 2021'),
      emoji: '<:bughunter:859189259603542076>',
      id: '2',
    }
  ] as Badge[],
  get: (id: string) => {
    return badges.LIST.find((b) => b.id === b.id) ?? null;
  }
}

export interface Badge {
  name: string,
  description: string,
  date: Date,
  emoji: EmojiResolvable,
  id: string,
}
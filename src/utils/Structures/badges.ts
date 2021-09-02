import { EmojiResolvable } from 'discord.js'

export interface BadgeManager {
  LIST: Badge[],
  get: (id: string) => Badge | undefined;
}

export class Badge {
  public name: string
  public description: string
  public date: Date
  public emoji: EmojiResolvable
  public id: string
  constructor(data: {name: string, description: string, date: Date, emoji: EmojiResolvable, id: string}) {
    this.name = data.name;
    this.description = data.description;
    this.date = data.date;
    this.emoji = data.emoji;
    this.id = data.id;
  }
}

export const badges: BadgeManager = {
  LIST: [
    new Badge({
      name: 'Developer',
      description: '',
      date: new Date('August 28, 2021'),
      emoji: '<:dev:853033685750382592>',
      id: '1',
    }),
    new Badge({
      name: 'Bughunter',
      description: '',
      date: new Date('August 28, 2021'),
      emoji: '<:bughunter:859189259603542076>',
      id: '2',
    }),
  ],
  get: (id: string) => {
    return badges.LIST.find((b) => b.id === id);
  },
}
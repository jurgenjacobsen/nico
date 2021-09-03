import { EmojiResolvable } from 'discord.js';

export interface BadgeManager {
  LIST: Badge[];
  get: (id: string) => Badge | undefined;
}

export class Badge {
  public name: string;
  public description: string;
  public date: Date;
  public emoji: EmojiResolvable;
  public id: string;
  constructor(data: { name: string; description: string; date: Date; emoji: EmojiResolvable; id: string }) {
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
      description: 'Aos desenvolvedores do nico.',
      date: new Date('August 28, 2021'),
      emoji: '<:dev:853033685750382592>',
      id: '1',
    }),
    new Badge({
      name: 'Bughunter',
      description: 'À todos os contribuidores do desenvolvimento do nico.',
      date: new Date('August 28, 2021'),
      emoji: '<:bughunter:859189259603542076>',
      id: '2',
    }),
    new Badge({
      name: 'Organizador de Evento',
      description: 'Dado ao organizar um evento ou forma de entreterimento com mais de vinte participantes.',
      date: new Date('September 2, 2021'),
      emoji: '<:events:859188901753913344>',
      id: '3',
    }),
    new Badge({
      name: 'Golden Bughunter',
      description: 'Dado quando um bughunter atingir cerca de 10 bugs reportados.',
      date: new Date('September 2, 2021'),
      emoji: '<:goldenhunter:857781575219544065>',
      id: '4',
    }),
  ],
  get: (id: string) => {
    return badges.LIST.find((b) => b.id === id);
  },
};

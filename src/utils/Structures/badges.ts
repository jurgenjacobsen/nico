import { EmojiResolvable } from 'discord.js';

export interface BadgeManager {
  LIST: Badge[];
  get: (id: string) => Badge | undefined;
  parseUser: (badges: string[]) => Badge[];
}

export class Badge {
  public name: string;
  public description: string;
  public date: Date;
  public emoji: EmojiResolvable;
  public id: string;
  public upgradeOf: string[];
  constructor(data: { name: string; description: string; date: Date; emoji: EmojiResolvable; id: string, upgradeOf: string[] }) {
    this.name = data.name;
    this.description = data.description;
    this.date = data.date;
    this.emoji = data.emoji;
    this.id = data.id.trim();
    this.upgradeOf = data.upgradeOf;
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
      upgradeOf: [],
    }),
    new Badge({
      name: 'Bughunter',
      description: 'À todos os contribuidores do desenvolvimento do nico.',
      date: new Date('August 28, 2021'),
      emoji: '<:bughunter:859189259603542076>',
      id: '2',
      upgradeOf: [],
    }),
    new Badge({
      name: 'Organizador de Evento',
      description: 'Dado ao organizar um evento ou forma de entreterimento com mais de vinte participantes.',
      date: new Date('September 2, 2021'),
      emoji: '<:events:859188901753913344>',
      id: '3',
      upgradeOf: [],
    }),
    new Badge({
      name: 'Golden Bughunter',
      description: 'Dado quando um bughunter atingir cerca de 10 bugs reportados.',
      date: new Date('September 2, 2021'),
      emoji: '<:goldenhunter:857781575219544065>',
      id: '4',
      upgradeOf: ['2'],
    }),
    new Badge({
      name: 'Membro - 6 Meses',
      description: 'Recebido pelos membros que estão há mais de 6 meses no servidor.',
      date: new Date('September 4, 2021'),
      emoji: '<:6meses:883565661748617267>',
      id: '5',
      upgradeOf: [],
    }),
    new Badge({
      name: 'Membro - 1 Ano',
      description: 'Recebido pelos membros que estão há mais de 1 ano no servidor.',
      date: new Date('September 4, 2021'),
      emoji: '<:1ano:883565662180634655>',
      id: '6',
      upgradeOf: ['5'],
    }),
    new Badge({
      name: 'Membro - 2 Anos',
      description: 'Recebido pelos membros que estão há mais de 2 anos no servidor.',
      date: new Date('September 4, 2021'),
      emoji: '<:2anos:883565662121893918>',
      id: '7',
      upgradeOf: ['6'],
    }),
  ],
  get: (id: string) => {
    return badges.LIST.find((b) => b.id === id);
  },
  parseUser: (b: string[]) => {
    let bs: Badge[] = [];
    let torem: string[] = [];
    for (let i = 0; i < b.length; i++) {
      let badgeId = b[i];
      let badge = badges.get(badgeId);
      if(badge) {
        bs.push(badge);
      }
    }
    bs.forEach((badge) => {
      badge.upgradeOf.forEach((ub) => {
        let index = bs.findIndex((b) => b.id === ub);
        if(index > -1) torem.push(ub);
      })
    });
    torem.forEach((id) => {
      let index = bs.findIndex((b) => b.id === id);
      if(index > -1) bs.splice(index, 1);
    });
    return bs;
  }
};

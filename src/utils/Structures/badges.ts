import { EmojiResolvable } from 'discord.js';
import { Database } from 'dsc.db';

export class Badge {
  public name: string;
  public description: string;
  public date: Date;
  public emoji: EmojiResolvable;
  public id: string;
  public upgradeOf: string[];
  constructor(data: { name: string; description: string; date: Date; emoji: EmojiResolvable; id: string; upgradeOf: string[] }) {
    this.name = data.name;
    this.description = data.description;
    this.date = data.date;
    this.emoji = data.emoji;
    this.id = data.id.trim();
    this.upgradeOf = data.upgradeOf;
  }
}

const badges = [
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
];

export class BadgesManager {
  public members: Database;
  constructor(members: Database) {
    this.members = members;
  }

  public get LIST(): Badge[] {
    return badges;
  }

  public get(id: string) {
    return this.LIST.find((b) => b.id === id);
  }

  public give(userId: string, badgeId: string): Promise<Badge | undefined> {
    return new Promise(async (resolve) => {
      let badge = this.get(badgeId);
      if (!badge) return resolve(undefined);

      let user = await this.members.fetch(userId);
      if (!user) return resolve(undefined);

      if (user.data.badges.includes(badgeId)) return undefined;

      this.members.push(`${userId}.badges`, badgeId).then((response) => {
        if (!response) return resolve(undefined);
        return resolve(badge);
      });
    });
  }

  public parseUser(badges: string[]): Badge[] {
    let bs: Badge[] = [];
    let torem: string[] = [];
    for (let i = 0; i < badges.length; i++) {
      let badgeId = badges[i];
      let badge = this.get(badgeId);
      if (badge) {
        bs.push(badge);
      }
    }
    bs.forEach((badge) => {
      badge.upgradeOf.forEach((ub) => {
        let index = bs.findIndex((b) => b.id === ub);
        if (index > -1) torem.push(ub);
      });
    });
    torem.forEach((id) => {
      let index = bs.findIndex((b) => b.id === id);
      if (index > -1) bs.splice(index, 1);
    });
    return bs;
  }
}

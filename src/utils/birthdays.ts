import { Collection } from 'discord.js'
import { Database } from 'dsc.db'
import { NicoUser, print } from './utils'

export class BirthdaysManager {
  public cache: BirthdaysCache
  private members: Database
  private bcb: BirthdayCallback | undefined
  private nbcb: BirthdayCallback | undefined
  constructor(members: Database) {
    this.cache = new Collection()
    this.members = members

    this._load()
    setInterval(() => {
      this._load()
    }, 60 * 1000)
  }

  private async _load() {
    let today = new Date()
    let hour = today.getHours()
    let min = today.getMinutes()

    if ((hour === 12 && [0, 1].includes(min)) || (hour === 0 && [0, 1].includes(min))) {
      print(`Checando as datas de aniversário do membros!`)
      let raw = await this.members.list()
      let members = raw?.map((r) => r.data) ?? []
      members.forEach((m: NicoUser, i) => {
        if (!m.birthday) return
        let bday = m.birthday
        let day = bday.getDate()
        let month = bday.getMonth() + 1
        if (today.getDate() === day && today.getMonth() + 1 === month) {
          if (this.bcb) this.bcb(m)
          this.members.set(`${m.id}.bdaynotified`, new Date())
        } else {
          if (this.nbcb) this.nbcb(m)
        }
      })
    }
  }

  public async on(type: 'NON-BDAY' | 'BDAY', cb: BirthdayCallback): Promise<void> {
    if (type === 'BDAY') {
      this.bcb = cb
    } else if (type === 'NON-BDAY') {
      this.nbcb = cb
    }
  }
}

export type BirthdaysCache = Collection<string, NicoUser>
export interface BirthdayCallback {
  (user: NicoUser): Promise<any> | any
}

import { EventOptions } from 'dsc.events'
import { print } from '../utils/utils'
import { Bot } from '../bot'

export const event: EventOptions = {
  name: 'ready',
  once: true,
  run: async (bot: Bot) => {
    print('Pronto! 😋');
  },
}

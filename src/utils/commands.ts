import { ApplicationCommandData } from 'discord.js'

export const data: ApplicationCommandData[] = [
  {
    name: 'economy',
    description: 'Informações sobre a economia do servidor.',
    defaultPermission: true,
    options: [],
  },
  {
    name: 'nico',
    description: 'Informações sobre mim',
    defaultPermission: true,
    options: [],
  },
  {
    name: 'userinfo',
    description: 'Mostra as informações de um usuário',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'membro',
        description: 'Usuário que você deseja ver as informações',
        type: 'USER',
        required: false,
      }
    ]
  },
  {
    name: 'together',
    description: 'Discord together',
    defaultPermission: true,
    options: [
      {
        name: 'type',
        description: 'Tipo de party',
        type: 'STRING',
        choices: [
          {name: 'Youtube', value: 'youtube'},
          {name: 'Poker', value: 'poker'},
          {name: 'Chess', value: 'chess'},
          {name: 'Betrayal', value: 'betrayal'},
          {name: 'Fishing', value: 'fishing'}
        ],
        required: true
      }
    ]
  }
]

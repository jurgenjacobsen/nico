import { ApplicationCommandData } from 'discord.js'

export const data: ApplicationCommandData[] = [
  {
    name: 'economy',
    description: 'Informações sobre a economia do servidor',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [],
  },
  {
    name: 'nico',
    description: 'Informações sobre mim',
    type: 'CHAT_INPUT',
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
    type: 'CHAT_INPUT',
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
  },
  {
    name: 'profile',
    description: 'Funções de perfis',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'show',
        description: 'Veja o perfil de um membro do servidor',
        type: 'SUB_COMMAND',
        options: [
          {
            required: false,
            name: 'membro',
            description: 'Membro pelo qual você deseja ver o perfil',
            type: 'USER'
          }
        ]
      },
      {
        name: 'create',
        description: 'Crie seu perfil caso não possua um',
        type: 'SUB_COMMAND',
        options: [
          { name: 'nome', description: 'Seu nome', required: false, type: 'STRING' },
          { name: 'sobre', description: 'Fale um pouco sobre você', required: false, type: 'STRING' },
          { name: 'aniversário', description: 'Quando você nasceu?', required: false, type: 'STRING' },
          { name: 'localização', description: 'De onde você é?', required: false, type: 'STRING' },
          { name: 'pronome', description: 'Qual seu pronome?', required: false, type: 'STRING' },
          { name: 'gênero', description: 'Qual seu gênero?', required: false, type: 'STRING' },
          { name: 'orientação', description: 'Qual sua orientação?', required: false, type: 'STRING' },
        ]
      },
      {
        name: 'edit',
        description: 'Edite alguma informação do seu perfil',
        type: 'SUB_COMMAND',
        options: [
          { name: 'nome', description: 'Seu nome', required: false, type: 'STRING' },
          { name: 'sobre', description: 'Fale um pouco sobre você', required: false, type: 'STRING' },
          { name: 'localização', description: 'De onde você é?', required: false, type: 'STRING' },
          { name: 'pronome', description: 'Qual seu pronome?', required: false, type: 'STRING' },
          { name: 'gênero', description: 'Qual seu gênero?', required: false, type: 'STRING' },
          { name: 'orientação', description: 'Qual sua orientação?', required: false, type: 'STRING' },
        ]
      }
    ],
  },
  {
    name: 'leaderboard',
    description: 'Mostra o top 10 de usuários de alguns sistemas do servidor',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'tipo',
        description: 'Qual dos leaderboards você deseja buscar',
        type: 'STRING',
        required: true,
        choices: [
          { name: 'economia', value: 'ECONOMY' },
          { name: 'níveis de voz', value: 'VOICE_LEVEL' },
          { name: 'níveis de texto', value: 'TEXT_LEVEL' }
        ]
      }
    ]
  }
]

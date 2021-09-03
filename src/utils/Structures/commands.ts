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
      },
    ],
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
          { name: 'Youtube', value: 'youtube' },
          { name: 'Poker', value: 'poker' },
          { name: 'Chess', value: 'chess' },
          { name: 'Betrayal', value: 'betrayal' },
          { name: 'Fishing', value: 'fishing' },
        ],
        required: true,
      },
    ],
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
            type: 'USER',
          },
        ],
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
        ],
      },
      {
        name: 'edit',
        description: 'Edite alguma informação do seu perfil',
        type: 'SUB_COMMAND',
        options: [
          { name: 'nome', description: 'Seu nome', required: false, type: 'STRING' },
          { name: 'sobre', description: 'Fale um pouco sobre você', required: false, type: 'STRING' },
          { name: 'aniversário', description: 'Quando você nasceu?', required: false, type: 'STRING' },
          { name: 'localização', description: 'De onde você é?', required: false, type: 'STRING' },
          { name: 'pronome', description: 'Qual seu pronome?', required: false, type: 'STRING' },
          { name: 'gênero', description: 'Qual seu gênero?', required: false, type: 'STRING' },
          { name: 'orientação', description: 'Qual sua orientação?', required: false, type: 'STRING' },
        ],
      },
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
          { name: 'níveis de texto', value: 'TEXT_LEVEL' },
        ],
      },
    ],
  },
  {
    name: 'deposit',
    description: 'Deposite o dinheiro da sua carteira',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'quantia',
        description: 'Quantia que você deseja depositar',
        type: 'NUMBER',
        required: false,
      },
    ],
  },
  {
    name: 'pix',
    description: 'Faz um pix para um usuário',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'membro',
        description: 'Usuário que você deseja transferir o dinheiro',
        type: 'USER',
        required: true,
      },
      {
        name: 'quantia',
        description: 'Quantia que você deseja transferir',
        type: 'NUMBER',
        required: true,
      },
    ],
  },
  {
    name: 'withdraw',
    description: 'Retire dinheiro do banco para sua carteira',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'quantia',
        description: 'Quantia que você deseja retirar',
        type: 'NUMBER',
        required: true,
      },
    ],
  },
  {
    name: 'sorteio',
    description: 'Cria um sorteio',
    type: 'CHAT_INPUT',
    defaultPermission: false,
    options: [
      {
        name: 'duração',
        description: 'A duração do sorteio',
        type: 'STRING',
        required: true,
      },
      {
        name: 'vencedores',
        description: 'Número de possíveis vencedores',
        type: 'INTEGER',
        required: true,
      },
      {
        name: 'prêmio',
        description: 'Qual será o prêmio do sorteio',
        type: 'STRING',
        required: true,
      },
      {
        name: 'canal',
        description: 'Qual será o canal em que o sorteio será enviado',
        type: 'CHANNEL',
        required: true,
      },
    ],
  },
  {
    name: 'serverinfo',
    description: 'Mostra informações do servidor',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [],
  },
  {
    name: 'card',
    description: 'O card de nível de voz ou texto de um membro',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'tipo',
        description: 'Qual dos cards você deseja ver',
        type: 'STRING',
        required: true,
        choices: [
          { name: 'voz', value: 'VOICE' },
          { name: 'texto', value: 'TEXT' },
        ],
      },
      {
        name: 'membro',
        description: 'Qual membro você deseja buscar',
        type: 'USER',
        required: false,
      },
    ],
  },
  {
    name: 'Notas',
    type: 'MESSAGE',
    defaultPermission: false,
  },
  {
    name: 'config',
    description: 'Configurações do servidor',
    defaultPermission: false,
    type: 'CHAT_INPUT',
    options: [
      {
        name: 'add',
        description: 'Adiciona um canal ou cargo às configurações',
        type: 'SUB_COMMAND',
        options: [
          {
            name: 'key',
            description: 'Qual configuração em específico você deseja editar',
            type: 'STRING',
            required: true,
            choices: [
              { name: 'Cargos de canal de voz', value: 'vcRoles' },
              { name: 'Canais de cargo de voz', value: 'vcRoleChannels' },
              { name: 'Categorias de cargo de voz', value: 'vcRolesCats' },
              { name: 'Cargos de evento', value: 'eventRoles' },
              { name: 'Canais de evento', value: 'eventChannels' },
              { name: 'Canais que contam xp', value: 'allowedXPChannels' },
              { name: 'Canais que contam estatísticas', value: 'allowedStatsChannels' },
              { name: 'Categorias que contam estatísticas', value: 'allowedStatsCats' },
              { name: 'Categorias que contam xp', value: 'allowedXPCats' },
              { name: 'Cargos de dobro de xp', value: 'DXPRoles' },
              { name: 'Canais de dobro de xp', value: 'DXPChannels' },
            ],
          },
          {
            name: 'canal',
            description: 'O canal que você deseja adicionar',
            type: 'CHANNEL',
            required: false,
          },
          {
            name: 'cargo',
            description: 'O cargo que você deseja adicionar',
            type: 'ROLE',
            required: false,
          },
        ],
      },
      {
        name: 'remove',
        description: 'Remove um canal ou cargo às configurações',
        type: 'SUB_COMMAND',
        options: [
          {
            name: 'key',
            description: 'Qual configuração em específico você deseja editar',
            type: 'STRING',
            required: true,
            choices: [
              { name: 'Cargos de canal de voz', value: 'vcRoles' },
              { name: 'Canais de cargo de voz', value: 'vcRoleChannels' },
              { name: 'Categorias de cargo de voz', value: 'vcRolesCats' },
              { name: 'Cargos de evento', value: 'eventRoles' },
              { name: 'Canais de evento', value: 'eventChannels' },
              { name: 'Canais que contam xp', value: 'allowedXPChannels' },
              { name: 'Canais que contam estatísticas', value: 'allowedStatsChannels' },
              { name: 'Categorias que contam estatísticas', value: 'allowedStatsCats' },
              { name: 'Categorias que contam xp', value: 'allowedXPCats' },
              { name: 'Cargos de dobro de xp', value: 'DXPRoles' },
              { name: 'Canais de dobro de xp', value: 'DXPChannels' },
            ],
          },
          {
            name: 'canal',
            description: 'O canal que você deseja adicionar',
            type: 'CHANNEL',
            required: false,
          },
          {
            name: 'cargo',
            description: 'O cargo que você deseja adicionar',
            type: 'ROLE',
            required: false,
          },
        ],
      },
      {
        name: 'show',
        description: 'Mostrar as configurações do servidor',
        type: 'SUB_COMMAND',
      },
    ],
  },
  {
    name: 'customize',
    description: 'Customizações do usuário',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'profile',
        type: 'SUB_COMMAND',
        description: 'Customize seu perfil',
        options: [
          {
            name: 'key',
            description: 'Qual opção você deseja editar',
            type: 'STRING',
            required: true,
            choices: [
              { name: 'Banner de perfil (URL do Imgur.com)', value: 'bannerURL' },
              { name: 'Cor do perfil Ex.: (#1c1c1c)', value: 'color' },
            ],
          },
          {
            name: 'data',
            description: 'A informação que você deseja salvar',
            type: 'STRING',
            required: true,
          },
        ],
      },
      {
        name: 'card',
        type: 'SUB_COMMAND',
        description: 'Customize seu card de níveis',
        options: [
          {
            name: 'key',
            description: 'Qual opção você deseja editar',
            type: 'STRING',
            required: true,
            choices: [
              { name: 'Opacidade da sobreposição', value: 'card.overlayOpacity' },
              { name: 'Cor do seu nível', value: 'card.levelColor' },
              { name: 'Cor do rank', value: 'card.rankColor' },
              { name: 'Cor da barra de progresso', value: 'card.progressBarColor' },
              { name: 'Plano de fundo (URL do imgur.com ou cor HEX)', value: 'card.background' },
            ],
          },
          {
            name: 'data',
            description: 'A informação que você deseja salvar',
            type: 'STRING',
            required: true,
          },
        ],
      },
    ],
  },
  {
    name: 'badges',
    description: 'Lista de todas as bagdes disponíveis no servidor',
    type: 'CHAT_INPUT',
    defaultPermission: true,
  },
  {
    name: 'reroll',
    description: 'Resorteia um sorteio',
    type: 'CHAT_INPUT',
    defaultPermission: false,
    options: [
      { 
        name: 'id',
        description: 'O id da mensagem do sorteio',
        required: true,
        type: 'STRING'
      }
    ]
  },
  {
    name: 'daily',
    description: 'Coleta o dinheiro diário',
    type: 'CHAT_INPUT',
    defaultPermission: true,
  },
  {
    name: 'store',
    description: 'Loja do servidor',
    type: 'CHAT_INPUT',
    defaultPermission: true,
    options: [
      {
        name: 'publish',
        description: 'Publica um item na loja',
        type: 'SUB_COMMAND',
        options: [
          {
            name: 'id',
            description: 'ID do item',
            type: 'STRING',
            required: true,
          },
          {
            name: 'cor',
            description: 'Cor do embed',
            type: 'STRING',
            required: true,
          },
          {
            name: 'banner',
            description: 'Banner do item',
            type: 'STRING',
            required: false,
          }
        ]
      }
    ]
  }
]

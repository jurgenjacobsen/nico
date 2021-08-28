import { CanvasRenderService } from "chartjs-node-canvas";
import { CommandInteraction, GuildMember, MessageAttachment, MessageEmbed } from "discord.js";
import { CommandOptions } from "dsc.cmds";
import { Bot } from "../bot";
import { print } from "../utils/utils";

export const cmd: CommandOptions = {
  name: 'userinfo',
  devOnly: true,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    let user = interaction.options.getUser('membro', false);
    if(!user) user = interaction.user;

    let member = await interaction.guild?.members.fetch(user.id) as GuildMember;
    if(!member || !member.joinedAt) {
      interaction.reply({ content: `Não foi possível ver o perfil de ${user.tag} pois aparentemente ele(a) não está no meu cache de usuários!`});
      return print(`Não foi possível ver o perfil de ${user.tag} pois aparentemente ele(a) não está no meu cache de usuários!`);
    }

    let stats = await bot.stats.users.graphicFormatData(user.id, 15);
    let eco = await bot.eco.ensure(interaction.user.id, interaction.guild?.id);
    let levels = await bot.levels.ensure(interaction.user.id, interaction.guild?.id);

    if(!stats) {
      await bot.stats.users.update(user.id, 'commands', 0);
      stats = await bot.stats.users.graphicFormatData(user.id, 15);
      if(!stats) {
        interaction.reply({ content: `Falha ao carregar estatísticas de ${user.tag}` });
        return print(`Falha ao carregar estatísticas de ${user.tag}`);
      }
    }

    let canvas = new CanvasRenderService(1080, 720, chartCB);
    let graphic = new MessageAttachment(await canvas.renderToBuffer({
      type: 'line',
      options: {
        legend: {
          labels: {
            fontColor: 'white',
            fontSize: 18,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                fontColor: '#ffffff',
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                min: 0,
                fontColor: '#ffffff',
              },
            },
          ],
        },
      },
      data: {
        labels: stats?.label,
        datasets: [
          {
            label: 'Mensagens Enviadas',
            data: stats?.messages,
            backgroundColor: '#5865F2',
            borderColor: '#5865F2',
            fill: false,
          },
          {
            label: 'Tempo em call',
            data: stats?.voice,
            backgroundColor: '#EB459E',
            borderColor: '#EB459E',
            fill: false,
          },
          {
            label: 'Comandos Usados',
            data: stats?.commands,
            backgroundColor: '#FFFFFF',
            borderColor: '#FFFFFF',
            fill: false,
          },
        ]
      }
    }), 'graphic.png');

    let jAt = 
    `${member.joinedAt.getDate() > 9 ? member.joinedAt.getDate() : `0${member.joinedAt.getDate()}`}/${(member.joinedAt.getMonth() + 1) > 9 ? member.joinedAt.getMonth() + 1 : `0${member.joinedAt.getMonth() + 1}`}/${member.joinedAt?.getFullYear()}`;

    let requirements = {
      messages: 60,
      voice: 2.5,
    };

    let medias = {
      messages: (stats.messages.reduce((a, b) => a + b)) / 15,
      voice: (stats.voice.reduce((a, b) => a + b)) / 60,
    };

    let embed = new MessageEmbed()
    .setColor(bot.config.color)
    .setAuthor(user.username, user.displayAvatarURL({dynamic: true, size: 256}))
    .setImage('attachment://graphic.png');

    let embed2 = new MessageEmbed()
    .setFooter(`ㅤㅤㅤ ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ`)
    .setColor(bot.config.color)
    .addField(`\`👥\` - Servidor`, `
    Entrou em: ${jAt}
    Cargos: ${member.roles.cache.size}
    Tag mais alta: ${member.roles.highest.toString()}
    \n
    `)
    .addField(`\`📈\` - Estatísticas`, `
    Média de mensagens - (${Math.floor(medias.messages)}/${requirements.messages})
    Média de tempo em call - (${String(medias.voice).includes(`.`) ? String(medias.voice).split('.')[0] + '.' + String(medias.voice).split('.')[1].slice(0, 1) : medias.voice}/${requirements.voice})
    \n
    `)
    .addField(`\`💳\` - Economia`, `
    Carteira: $${eco.wallet}
    Banco: $${eco.bank}
    Inventário: ${eco.inventory.length > 0 ? eco.inventory.map((i) => i.name).join(', ') : `*Vazio*`}
    \n
    `)
    .addField(`\`🏷️\` - Níveis`, `
    Voz ${levels.voiceLevel} - *${levels.voiceXp}xp*
    Texto ${levels.textLevel} - *${levels.textXp}xp*
    `)

    interaction.reply({
      embeds: [embed, embed2],
      files: [graphic],
    });
  }
};

function chartCB(ChartJS: any) {
  ChartJS.plugins.register({
    beforeDraw: (chartInstance: any) => {
      const { chart } = chartInstance;
      const { ctx } = chart;
      ctx.fillStyle = '#23272A';
      ctx.fillRect(0, 0, chart.width, chart.height);
    },
  });
};
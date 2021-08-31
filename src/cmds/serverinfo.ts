import { CanvasRenderService } from 'chartjs-node-canvas'
import { CommandInteraction, MessageActionRow, MessageAttachment, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js'
import { CommandOptions } from 'dsc.cmds'
import { Bot } from '../bot'

export const cmd: CommandOptions = {
  name: 'serverinfo',
  guildOnly: true,
  cooldown: 10,
  run: async (bot: Bot, interaction: CommandInteraction) => {
    if (!interaction.guild) return

    let stats = await bot.stats.guild.graphicFormatData(interaction.guild.id, 15)

    async function pageUp(members?: boolean) {
      if (!interaction.guild) return

      let options = {
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
      }

      let config = {
        type: 'line',
        options,
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
            {
              label: 'Total de membros',
              data: stats?.totalMembers,
              backgroundColor: '#ED4245',
              borderColor: '#ED4245',
              fill: false,
            },
          ],
        },
      }

      if (members) {
        config.data = {
          labels: stats?.label,
          datasets: [
            {
              label: 'Membros que saíram',
              data: stats?.leftMembers,
              backgroundColor: '#57F287',
              borderColor: '#57F287',
              fill: false,
            },
            {
              label: 'Membros que entraram',
              data: stats?.newMembers,
              backgroundColor: '#FEE75C',
              borderColor: '#FEE75C',
              fill: false,
            },
          ],
        }
      }

      let canvas = new CanvasRenderService(1080, 720, chartCB)
      let graphic = new MessageAttachment(await canvas.renderToBuffer(config), `graphic${members ? '' : 1}.png`)

      let embed = new MessageEmbed().setColor(bot.config.color).setImage(`attachment://graphic${members ? '' : 1}.png`)

      if (!members) {
        embed.setAuthor(`Estatísticas`)
      }

      return {
        embed: embed,
        file: graphic,
      }
    }

    let data = await pageUp()
    let data2 = await pageUp(true)
    if (!data) return
    if (!data2) return

    interaction.reply({
      embeds: [data.embed, data2.embed],
      files: [data.file, data2.file],
    })
  },
}

function chartCB(ChartJS: any) {
  ChartJS.plugins.register({
    beforeDraw: (chartInstance: any) => {
      const { chart } = chartInstance
      const { ctx } = chart
      ctx.fillStyle = '#23272A'
      ctx.fillRect(0, 0, chart.width, chart.height)
    },
  })
}

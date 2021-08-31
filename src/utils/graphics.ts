import { CanvasRenderService } from "chartjs-node-canvas";
import { Collection, GuildMember, Snowflake } from "discord.js";
import { GuildStats, UserStats } from "dsc.stats";

export type Members = Collection<string, GuildMember>;

export class GraphicsManager {
  public cache: Collection<Snowflake, Buffer>;
  private stats: UserStats | GuildStats;

  constructor(stats: UserStats | GuildStats) {
    this.cache = new Collection();

    this.stats = stats;
  }

  public fetch(id: string): Promise<Buffer> {
    return new Promise(async (resolve) => {
      let stats = await this.stats.graphicFormatData(id, 15);
      let canvas = new CanvasRenderService(1080, 720, chartCB);
      let buffer = await canvas.renderToBuffer({
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
          ],
        },
      });
      this.timecache(id, buffer);
      return resolve(buffer);
    })
  }

  public timecache(id: string, buffer: Buffer): void {
    this.cache.set(id, buffer);
    setTimeout(() => {

    }, 30 * 60 * 1000);
  }
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
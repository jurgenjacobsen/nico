import express from 'express';
import * as TOPGGG_SDK from "@top-gg/sdk";
import { bot } from '../bot';
import { TextChannel } from 'discord.js';

const app = express();
const topWebhook = new TOPGGG_SDK.Webhook(process.env.TOPGG_AUTH);

app.get('/', (req, res) => {
  res.send(`clancys not here`)
})

app.post(
  "/vote",
  topWebhook.listener((vote) => {
    if (vote.guild !== "465938334791893002") return;

    const member = bot.guilds.cache.get(vote.guild)?.members.cache.get(vote.user);

    if (!member) return;

    member.roles
      .add("793163223867719742")
      .catch((err) => {
        const channel = bot.channels.cache.get(`840045583028715541`) as TextChannel;
        if (!channel) return console.log(err);
        channel.send({ content: err }).catch(() => {});
      })
      .then(() => {
        setTimeout(() => member?.roles.remove("793163223867719742"), 10 * 60 * 1000);
      });
  })
);

export { app };
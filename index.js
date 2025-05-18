import express from "express";

import { channels } from "./src/channels.js";
import { listener } from "./src/dbConfig.js";
import { runCron } from "./src/cron/index.js";
const app = express();
const PORT = 3002;

listener.events.on("error", (err) => {
  console.error("Listener error:", err);
});
runCron();
app.listen(PORT, async () => {
  console.log(`running at http://localhost:${PORT}`);

  try {
    await listener.connect();

    for (const channel of Object.keys(channels)) {
      await listener.listenTo(channel);
      listener.notifications.on(channel, channels[channel]);
      console.log(`🟢 Listening to "${channel}"`);
    }
  } catch (err) {
    console.log(err, "error here");
  }
});

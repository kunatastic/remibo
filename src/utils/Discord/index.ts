import { Client, Message, Intents } from "discord.js";
import { checkCommands } from "./Commands";

// Registering Discord to use google api
const client = new Client();

// Client on ready
client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.user?.setPresence({
    status: "online",
    activity: {
      name: "!remibo",
      type: "PLAYING",
      url: `${process.env.ROOT_URL}`,
    },
  });
});

// Client on message
client.on("message", async (message: Message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (
    !message.content.startsWith(process.env.DISCORD_BOT_PREFIX || "!google")
  ) {
    return;
  }

  const lowerCaseMessage: String = message.content.toLowerCase();
  const args: String[] = lowerCaseMessage.split(" ");

  // Command Architecture
  // prefix + instruction + value
  // console.log(args);
  checkCommands(args, message);
});

// Export the client
module.exports = client;

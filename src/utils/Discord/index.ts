import { Client, Message, Intents } from "discord.js";
import { checkCommands } from "./Commands";

// Registering Discord to use google api
const client = new Client();

// Client on ready
client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  // client.user?.setPresence({ game: { name: 'with discord.js' }, status: 'idle' });
  // Set the client user's presence
  client.user?.setActivity(`${process.env.DISCORD_BOT_PREFIX} - Remibo help`, {
    type: "PLAYING",
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

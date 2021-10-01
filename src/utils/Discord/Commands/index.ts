import { Message } from "discord.js";
import { deleteUserOAuth2Token } from "../../Google/OAuth";

export async function checkCommands(args: String[], message: Message) {
  console.log("New message", args);
  if (args.length == 1) {
    message.reply("Please provide a command");
    return;
  }

  if (args[1] == "verify") {
    message.reply(
      `Verify command ${process.env.ROOT_URL}/u/${message.author.id}`
    );
  } else if (args[1] == "reminder") {
    if (args.length == 2) {
      message.reply("Please enter a valid attribute ");
      return;
    }

    if (args[2] == "countdown") {
    } else if (args[2] == "date") {
    } else {
      message.reply("Invalid Command");
    }
  } else if (args[1] == "help") {
    message.reply("Help");
  } else if (args[1] == "delete") {
    const deleteStatus = await deleteUserOAuth2Token(message.author.id);
    if (deleteStatus) {
      message.reply("We have deleted your profile...");
    } else {
      message.reply("We could not deleted your profile...");
    }
  } else {
    message.reply("Command not found");
  }
}

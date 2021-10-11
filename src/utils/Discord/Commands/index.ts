import { Message } from 'discord.js';
import { userExists } from '../../DB';
import { deleteUserOAuth2Token } from '../../Google/OAuth';

export async function checkCommands(args: String[], message: Message) {
  // console.log("New message", args);
  if (args.length == 1) {
    message.reply('Please provide a command');
    return;
  }

  // TODO: Ping command
  if (args[1] == 'ping') {
    const latency = Date.now() - message.createdTimestamp;
    message.reply(`Pong! Latency of ${latency}ms.`);
  }

  // TODO: Verify a new user
  else if (args[1] == 'verify') {
    message.reply(
      `Verify command ${process.env.ROOT_URL}/u/${message.author.id}`
    );
  }
  // TODO: Set a new reminder for the user
  else if (args[1] == 'reminder' || args[1] == 'rem') {
    if (args.length == 2) {
      message.reply('Please enter a valid attribute ');
      return;
    }

    // TODO: Check if the user is registered
    const userRegistered = await userExists(message.author.id);
    if (!userRegistered) {
      message.reply('Please register first use command `!google verify`');
      return;
    }

    // TODO: Set a countdown reminder
    if (args[2] == 'countdown' || args[2] == 'cd' || args[2] == 'in') {
      if (args.length == 3) {
        message.reply(
          'Time attribute was not provided :smiling_face_with_tear:'
        );
        return;
      }

      console.log(args);
    }
    // TODO: Set a date specific reminder
    else if (args[2] == 'date' || args[2] == 'd' || args[2] == 'on') {
      console.log(
        'Message recieved from ' +
          message.author.id +
          ' at ' +
          Date.now().toString()
      );
    }
    // TODO: Fallback command
    else {
      message.reply('Invalid Command');
    }
  }
  // TODO: Send the help command
  else if (args[1] == 'help' || args[1] == 'h') {
    message.reply('Help');
  }
  // TODO: Delte the user's OAuth2 token
  else if (args[1] == 'delete' || args[1] == 'del') {
    const deleteStatus = await deleteUserOAuth2Token(message.author.id);
    if (deleteStatus) {
      message.reply('We have deleted your profile...');
    } else {
      message.reply('We could not deleted your profile...');
    }
  }
  // TODO: Fallback response
  else {
    message.reply('Command not found');
  }
}

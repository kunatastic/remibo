import { Message } from "discord.js";
import { calendar_v3 } from "googleapis";
import { userExists } from "../../DB";
import {
  createCalendarClient,
  insertEventCalender,
} from "../../Google/Calender";
import { createOAuthConfig, deleteUserOAuth2Token } from "../../Google/OAuth";

const OAuthConfig = createOAuthConfig();

export async function checkCommands(args: String[], message: Message) {
  // console.log("New message", args);
  if (args.length == 1) {
    message.reply("Please provide a command");
    return;
  }

  // TODO: Ping command
  if (args[1] == "ping") {
    const latency = Date.now() - message.createdTimestamp;
    message.reply(`Pong! Latency of ${latency}ms.`);
  }

  // TODO: Verify a new user
  else if (args[1] == "verify") {
    message.reply(`Verify command ${process.env.ROOT_URL}/login`);
  }

  // TODO: Set a new reminder for the user
  else if (args[1] == "reminder" || args[1] == "rem") {
    if (args.length == 2) {
      message.reply("Please enter a valid attribute ");
      return;
    }

    // TODO: Check if the user is registered
    const userRegistered = await userExists(message.author.id);
    if (!userRegistered) {
      message.reply(
        `Please register first use command \`${process.env.DISCORD_BOT_PREFIX} verify\``
      );
      return;
    }

    // TODO: Set a countdown reminder
    if (args[2] == "countdown" || args[2] == "cd" || args[2] == "in") {
      if (args.length == 3) {
        message.reply(
          "Time attribute was not provided :smiling_face_with_tear:"
        );
        return;
      }
      // console.log(message.content.toLowerCase());
      console.log(userRegistered.access_token);
      const calender = createCalendarClient(
        OAuthConfig,
        userRegistered.refresh_token
      );

      const eventData: calendar_v3.Schema$Event = {
        summary: "New Event",
        colorId: "1",
        description: "Added by remibo",
        start: {
          dateTime: new Date().toISOString(),
        },
      };

      const events = await insertEventCalender(calender, eventData);
      message.reply(JSON.stringify(events));

      // const events = await getEvents(calender);
      // res.json(events);
    }

    // TODO: Set a date specific reminder
    else if (args[2] == "date" || args[2] == "d" || args[2] == "on") {
      console.log(
        "Message recieved from " +
          message.author.id +
          " at " +
          Date.now().toString()
      );
    }

    // TODO: Fallback command
    else {
      message.reply("Invalid Command");
    }
  }

  // TODO: Send the help command
  else if (args[1] == "help" || args[1] == "h") {
    message.reply("Help");
  }

  // TODO: Delte the user's OAuth2 token
  else if (args[1] == "delete" || args[1] == "del") {
    const deleteStatus = await deleteUserOAuth2Token(message.author.id);
    if (deleteStatus) {
      message.reply("We have deleted your profile...");
    } else {
      message.reply("We could not deleted your profile...");
    }
  }

  // TODO: Fallback response
  else {
    message.reply("Command not found");
  }
}

// Convert the string to a date using regex
function convertStringToDate(dateString: string) {
  const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  if (dateRegex.test(dateString)) {
    return new Date(dateString);
  }
  return new Date();
}

// test convertStringToDate
console.log(convertStringToDate("01-01-2020"));

// Convert the string to datetime using regex
function convertStringToDateTime(dateTimeString: string) {
  const dateTimeRegex = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}$/;
  if (dateTimeRegex.test(dateTimeString)) {
    return new Date(dateTimeString);
  }
  return new Date();
}

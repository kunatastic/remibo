import { Connection, connect, disconnect } from "mongoose";

let database: Connection;

export function DBConnection() {
  const MONGODB_URI = "mongodb://localhost:27017/ReminderBotToken";
  // process.env.MONGODB_URI || "mongodb://localhost:27017/ReminderBotToken";

  // If database already connected, return
  if (database) return;

  connect(MONGODB_URI);
  database = new Connection();
  database.once("open", async () => console.log("Connected to database"));
  database.on("error", () => console.log("Error connecting to database"));
}

export function DBDisconnect() {
  if (!database) return;
  disconnect();
}

module.exports = { DBConnection, DBDisconnect };

console.log("Welcome to the Google Integrated Discord Bot");

// ============x============== EXPRESS SERVER =============x=============

// Environment variables declaration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
const app: Application = express();
import { DBConnection, DBDisconnect } from "./utils/DB/DB.config";
import path from "path";
import mongoose from "mongoose";

// DB connection
mongoose.connect(
  process.env.MONGO_URI || "mongodb://localhost:27017/remibo",
  {},
  () => {
    console.log("DB connected");
  }
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("common"));
app.set("views", path.join(__dirname, "/views"));
app.engine("html", require("ejs").renderFile);

// Routes
app.use("/", require("./apis/"));
app.use("/a", require("./apis/auth"));
app.use("/p", require("./apis/pages"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});

// ============x============== DISCORD BOT =============x=============

// Initialize Discord Bot
const DiscordClient = require("./utils/Discord");

// login to the discord client
DiscordClient.login(process.env.DISCORD_TOKEN);

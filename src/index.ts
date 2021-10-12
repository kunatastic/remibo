import express, { Application } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import mongoose from "mongoose";

console.log("Welcome to the Google Integrated Discord Bot");

// Environment variables declaration
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const app: Application = express();

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
app.use("/u", require("./apis/users"));

// DB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/remibo", {})
  .then(() => {
    console.log("DB connected");

    // ============x============== EXPRESS SERVER =============x==========
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Listening on port http://localhost:${PORT}`);
    });

    // ============x============== DISCORD BOT =============x=============

    // Initialize Discord Bot
    const DiscordClient = require("./utils/Discord");

    // login to the discord client
    DiscordClient.login(process.env.DISCORD_TOKEN);
  });

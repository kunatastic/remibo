import express, { Request, Response } from "express";
import { TokenModel } from "../models/TokenModel";
import {
  createCalendarClient,
  insertEventCalender,
} from "../utils/Google/Calender";
import { createOAuthConfig } from "../utils/Google/OAuth";
const router = express.Router();

const OAuthConfig = createOAuthConfig();

router.get("/", (req: Request, res: Response) => {
  // res.render("index.html");
  res.json({ status: 200, msg: "AM I WORKING??" });
});

router.get("/u/:discordId", (req: Request, res: Response) => {
  res.cookie("discordId", req.params.discordId);
  res.redirect("/a/init");
});

router.get("/u/newEvent", async (req: Request, res: Response) => {
  const userInfo = await TokenModel.findOne({
    discordId: req.cookies.discordId,
  });
  if (!userInfo) return null;
  const calender = createCalendarClient(OAuthConfig, userInfo.refresh_token);
  const events = await insertEventCalender(calender);
  res.json(events);
});

module.exports = router;

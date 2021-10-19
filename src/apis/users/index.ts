import express, { Request, Response } from "express";
import { TokenModel } from "../../models/TokenModel";
import {
  createCalendarClient,
  insertEventCalender,
} from "../../utils/Google/Calender";
import { createOAuthConfig } from "../../utils/Google/OAuth";

const router = express.Router();
const OAuthConfig = createOAuthConfig();

router.get("/newEvent", async (req: Request, res: Response) => {
  const { discordId } = req.cookies;
  const userInfo = await TokenModel.findOne({ discordId });
  if (!userInfo) return null;
  const calender = createCalendarClient(OAuthConfig, userInfo.refresh_token);
  const events = await insertEventCalender(calender, undefined);
  res.json(events);
});
module.exports = router;

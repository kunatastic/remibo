import express, { Request, Response } from "express";
import { TokenModel } from "../../models/TokenModel";
import { userExists } from "../../utils/DB";
import { createCalendarClient, getEvents } from "../../utils/Google/Calender";

import {
  createOAuthConfig,
  getConnectionUrl,
  getUserInfo,
} from "../../utils/Google/OAuth";
const router = express.Router();

const OAuthConfig = createOAuthConfig();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Redirect to the Google consent page
router.get("/init", async (req: Request, res: Response) => {
  try {
    // check if DiscordId already exists in DB
    const UserExists = await userExists(req.cookies.discordId);
    if (UserExists) {
      res.redirect("/p/alreadyVerified");
      return;
    }

    const OAuthURL = getConnectionUrl(OAuthConfig);
    res.redirect(OAuthURL);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// Get the access token from the Google consent page
router.get("/google", async (req: Request, res: Response) => {
  try {
    // if user didn't authorize the app, redirect to the error page
    if ("error" in req.query) {
      res.redirect("/p/permission");
      return;
    }

    // Get the code from the quert string
    const code: any = req.query.code;

    // Get refresh token values
    const { tokens } = await OAuthConfig.getToken(code);
    const { discordId } = req.cookies;
    // Store the token values in DB
    try {
      const storedTokens = new TokenModel({
        discordId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date,
        id_token: tokens.id_token,
      });

      const tokenData = await storedTokens.save();
      console.log(tokenData);
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
    }

    res.redirect("/p/verified");
    // const calender = createCalendarClient(OAuthConfig, tokens.access_token);

    // const events = await getEvents(calender);
    // res.json(events);
  } catch (err: any) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

module.exports = router;

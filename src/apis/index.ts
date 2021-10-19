import express, { Request, Response } from "express";
import { TokenModel } from "../models/TokenModel";
import { createOAuthConfig } from "../utils/Google/OAuth";
import fetch from "node-fetch";

const router = express.Router();
const OAuthConfig = createOAuthConfig();

router.get("/", (req: Request, res: Response) => {
  res.render("welcome.html");
});

router.get("/invite", (req: Request, res: Response) => {
  res.redirect(
    "https://discord.com/api/oauth2/authorize?client_id=899886801613889576&permissions=149568&scope=bot"
  );
});

router.get("/login", (req: Request, res: Response) => {
  res.redirect(
    `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&redirect_uri=${process.env.DISCORD_REDIRECT_URL}&response_type=code&scope=identify`
  );
});

router.get("/fb/discord", async (req: Request, res: Response) => {
  try {
    if ("error" in req.query) {
      res.redirect("/p/permission");
      return;
    }
    const code: any = req.query.code;
    var response = await fetch(`https://discordapp.com/api/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || "",
        client_secret: process.env.DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URL || "",
        scope: "identify",
      }),
    });
    const discordOauth = await response.json();
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        authorization: `${discordOauth.token_type} ${discordOauth.access_token}`,
      },
    });
    const userResult = await userResponse.json();
    res.cookie("discordId", userResult.id);
    res.redirect("/a/init");
  } catch (err: any) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

// Get the access token from the Google consent page
router.get("/fb/google", async (req: Request, res: Response) => {
  try {
    if ("error" in req.query) {
      res.redirect("/p/permission");
      return;
    }
    const code: any = req.query.code;
    const { tokens } = await OAuthConfig.getToken(code);
    const { discordId } = req.cookies;
    try {
      tokens["discordId"] = discordId;
      const storedTokens = new TokenModel(tokens);
      await storedTokens.save();
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

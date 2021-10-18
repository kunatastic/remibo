import express, { Request, Response } from "express";
import { userExists } from "../../utils/DB";
import {
  createOAuthConfig,
  getConnectionUrl,
  getUserInfo,
} from "../../utils/Google/OAuth";

const router = express.Router();
const OAuthConfig = createOAuthConfig();

router.get("/", (req: Request, res: Response) => {
  res.json({
    msg: "Hey there!!",
    surprise: `Special surprise for you ${process.env.ROOT_URL}/a/surprise`,
  });
});

router.get("/surprise", (req: Request, res: Response) => {
  res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});

// Redirect to the Google consent page
router.get("/init", async (req: Request, res: Response) => {
  try {
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

module.exports = router;

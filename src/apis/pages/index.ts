import express, { Request, Response } from "express";
const router = express.Router();

router.get("/alreadyVerified", (req: Request, res: Response) => {
  res.send("Already Verified");
});

router.get("/verified", (req: Request, res: Response) => {
  res.send("Verified");
});

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Google-Discord-Reminder-Bot V0.3.0");
});

module.exports = router;

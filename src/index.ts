import { config } from "dotenv";
import * as twilio from "twilio";
import express, {Request, Response, NextFunction} from "express";
import { getCoinPrice } from "./utils/getCoinPrice";
import { checkPrices } from "./scheduler";
import Redis from "ioredis";
import { jwtCheck } from './utils/auth';


config();
const app = express();
const PORT = process.env.PORT || 3000;

const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redisClient.on("error", (err) => {
  console.error("Redis error ", err);
});

app.use(express.urlencoded({ extended: false }));

app.post("/sms", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const SMS = twiml;
  const recievedSMS = req.body.Body.toLowerCase().trim();
  const firstWord = recievedSMS.split(" ")[0];

  if (firstWord === "track") {
    const coinID = recievedSMS.split(" ")[1];
    if (coinID) {
      const coinPrice = await getCoinPrice(`${coinID}`);
      if (!coinPrice) {
        SMS.message("Coin not found");
      } else {
        const sub = {
          number: req.body.From,
          token: coinID,
          targetPrice: coinPrice.price,
        };
        redisClient.rpush("subscribers", JSON.stringify(sub), (err) => {
          console.log("rpush subscribers", sub);
          if (err) {
            console.error("Error adding subscriber to Redis:", err);
            SMS.message("Error tracking coin. Please try again later.");
          } else {
            SMS.message(`You are now tracking ${coinPrice.name}`);
          }
        });

        SMS.message(`You are now tracking ${coinPrice.name}`);
        SMS.message(`You are now tracking ${coinPrice.price}`);
      }
    }
  } else {
    SMS.message('To start tracking eth, text "track" followed by the coin ID');
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Call checkPrice function every minute
setInterval(() => {
  checkPrices(redisClient);
}, 60000);

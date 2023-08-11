import { config } from "dotenv";
import * as twilio from "twilio";
import express, { Request, Response, NextFunction } from "express";
import { getCoinPrice } from "./utils/getCoinPrice";
import { checkPrices } from "./scheduler";
import Redis from "ioredis";
import { jwtCheck } from "./utils/auth";

config();
const app = express();
const PORT = process.env.PORT || 3000;
const TIMEOUT_MS = 2000;

const redisClient = new Redis({
  host: "redis", 
  port: Number(process.env.REDIS_PORT) || 6379, // Convert to number
});

const connectToRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
    console.log("Redis status: ", redisClient.status);
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    console.log("Redis status: ", redisClient.status);
    setTimeout(connectToRedis, TIMEOUT_MS);
  } finally{
    await redisClient.quit();
  }
};


connectToRedis();
app.use(express.urlencoded({ extended: false }));

app.post("/sms", async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const SMS = twiml;
  const receivedSMS = req.body.Body.toLowerCase().trim();
  const words = receivedSMS.split(" ");

  if (words[0] === "track" && words.length === 3) {
    const symbol = words[1];
    const targetPrice = parseFloat(words[2]);

    if (isNaN(targetPrice)) {
      SMS.message("Invalid target price. Please provide a valid number.");
    } else {
      const coinData = await getCoinPrice(symbol);

      if (!coinData) {
        SMS.message("Coin not found");
      } else {
        const sub = {
          number: req.body.From,
          token: symbol,
          targetPrice: targetPrice,
        };
        await redisClient.lpush('subscribers', JSON.stringify(sub));
        SMS.message(`You are now tracking ${coinData.name} for a target buy price of $${targetPrice}`);
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

// Call checkPrice function every 5 minutes
setInterval(() => {
  checkPrices(redisClient);
}, 300000);

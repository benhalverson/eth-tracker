import { config } from "dotenv";
import * as twilio from "twilio";
import { getCoinPrice } from "./utils/getCoinPrice";
import Redis from "ioredis";

config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const twilioNumber = process.env.TWILIO_NUMBER;

const client = new twilio.Twilio(accountSid, authToken);

export async function checkPrices(redisClient: Redis) {
  const subscribers = await redisClient.lrange("subscribers", 0, -1);
  const parsedSubscribers = subscribers.map((sub) => JSON.parse(sub));

  for (const sub of parsedSubscribers) {
    const { number, token, targetPrice } = sub;
    const coinData = await getCoinPrice(token);

    if (coinData && coinData.price <= targetPrice) {
      const message = `The current price of ${coinData.name} is now $${coinData.price}, which is below your target buy price of $${targetPrice}.`;

      client.messages
        .create({
          from: twilioNumber,
          to: number,
          body: message,
        })
        .then((message) => {
          console.log("SMS sent:", message.sid);
        })
        .catch((err) => console.log(err));
    }
  }
}

export interface Subscriber {
  number: string;
  token: string;
  targetPrice: number;
}

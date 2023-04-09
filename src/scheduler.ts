import * as dotenv from "dotenv";
import * as twilio from "twilio";
import { getCoinPrice } from "./utils/getCoinPrice";
import Redis from "ioredis";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const twilioNumber = process.env.TWILIO_NUMBER;

const client = new twilio.Twilio(accountSid, authToken);

export async function checkPrices(redisClient: Redis) {
  redisClient.lrange(
    "subscribers",
    0,
    -1,
    async (err: any, subscribers) => {
      console.log("checkPrices subscribers", subscribers);
      if (err) {
        console.error("Error fetching subscribers from Redis:", err);
        return;
      }

      for (const subJson of subscribers as any) {
        const coinPrice = await getCoinPrice(subJson.token);
        if (coinPrice?.price <= subJson.targetPrice) {
          sendSMS(
            subJson.number,
            `${coinPrice?.name} has dropped below ${subJson.targetPrice}. Current price: ${coinPrice?.price}`
          );
          redisClient.lrem("subscribers", 0, subJson).catch((err) => {
            console.error("Error removing subscriber from Redis:", err);
          });
        }
      }
    }
  );
}

async function sendSMS(to: string, body: string) {
  try {
    const message = await client.messages.create({
      from: twilioNumber,
      to,
      body,
    });
    console.log(`Message sent to ${to}: ${body}`);
  } catch (err: any) {
    console.error(`Error sending message to ${to}: ${err.message}`);
  }
}

export interface Subscriber {
  number: string;
  token: string;
  targetPrice: number;
}

import * as dotenv from "dotenv";
import * as twilio from "twilio";
import axios from "axios";
import express from "express";
import { getCoinPrice } from './utils/getCoinPrice';
import { subscribers } from './data';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;



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
        subscribers.push(sub);
        SMS.message(`You are now tracking ${coinPrice.name}`);
      }
    }
  } else {
    SMS.message('To start tracking eth, text "track" followed by the coin ID');
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});


getCoinPrice("btc");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


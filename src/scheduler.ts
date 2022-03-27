import * as dotenv from 'dotenv';
import * as twilio from "twilio";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

if(accountSid && authToken && twilioNumber) {
const client = new twilio.Twilio(accountSid, authToken);
const myNumber = '+14084094639';

client.messages
  .create({
    from: twilioNumber,
    to: myNumber,
    body: "Hello from Node",
  })
  .then((message) => {
    console.log('status', message.status)
    console.log('sid', message.sid)
    console.log('date', message.dateSent)
  })
  .catch((err) => console.log(err));
}


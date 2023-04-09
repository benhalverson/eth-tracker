# setup 
rename .env.local to .env

`npm i` 

`npm run dev`


# install twillio cli
`npm install -g twilio-cli`

`twilio login`

`twilio phone-numbers:update "+TWILIO_NUMBER" --sms-url="http://localhost:3000/sms"`

see the docs for more info 
https://www.twilio.com/docs/twilio-cli/quickstart


in one terminal run `npm run dev` to start the local server
in another terminal run `twilio phone-numbers:update "+TWILIO_NUMBER" --sms-url="http://localhost:3000/sms"`
in another terminal start docker with a redis instance `docker run --name my-redis -p 6379:6379 -d redis`

send a text messsage with track eth 1000 to your twilio number 

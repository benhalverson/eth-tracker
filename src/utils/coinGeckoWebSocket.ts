import WebSocket from "ws";
import { Subscriber } from "../subscriberTypes";
import { redisClient } from "../redisClient";

// verify that coinGecko has a websocket server
const ws = new WebSocket("wss://ws.coingecko.com");

ws.on("open", () => {
  console.log("WebSocket connection opened");
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

export const addSubscriber = (subscriber: Subscriber) => {
  redisClient.rpush(
    "subscribers",
    JSON.stringify(subscriber),
    (err: any) => {
      if (err) console.error("Error adding subscriber to Redis:", err);
    }
  );

  ws.send(
    JSON.stringify({
      type: "subscribe",
      to: `${subscriber.token.toLowerCase()}_usd`,
    })
  );
};

export const removeSubscriber = (number: string, token: string) => {
  redisClient.lrange("subscribers", 0, -1, (err, items) => {
    if (err) {
      console.error("Error reading subscribers from Redis:", err);
    } else {
      items?.forEach((item) => {
        const subscriber = JSON.parse(item) as Subscriber;
        if (subscriber.number === number && subscriber.token === token) {
          redisClient.lrem("subscribers", 1, item);
          if (!items.some((i) => JSON.parse(i).token === token)) {
            ws.send(
              JSON.stringify({
                type: "unsubscribe",
                from: `${token.toLowerCase()}_usd`,
              })
            );
          }
        }
      });
    }
  });
};

export const updateSubscriber = (number: string, token: string, newTargetPrice: number) => {
  redisClient.lrange("subscribers", 0, -1, (err, items) => {
    if (err) {
      console.error("Error reading subscribers from Redis:", err);
    } else {
      items?.forEach((item, index) => {
        const subscriber = JSON.parse(item) as Subscriber;
        if (subscriber.number === number && subscriber.token === token) {
          subscriber.targetPrice = newTargetPrice;
          redisClient.lset("subscribers", index, JSON.stringify(subscriber));
        }
      });
    }
  });
};

ws.on("message", (data) => {
  const message = JSON.parse(data.toString());

  if (message.type === "ticker") {
    const symbol = message.exchange;
    const currentPrice = message.price;

    redisClient.lrange("subscribers", 0, -1, (err, items) => {
      if (err) {
        console.error("Error reading subscribers from Redis:", err);
      } else {
        items?.forEach((item) => {
          const subscriber = JSON.parse(item) as Subscriber;
          if (subscriber.token === symbol && currentPrice <= subscriber.targetPrice) {
            // Send SMS notification
          }
        });
      }
    });
  }
});

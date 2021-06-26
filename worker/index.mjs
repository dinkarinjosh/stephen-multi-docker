import keys from "./keys.mjs";
import redis from "redis";

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retryStrategy: () => 1000,
});

const sub = redisClient.duplicate();
const fibArray = [];
const fibCalculate = (index) => {
  const fibArray = [];
  for (let i = 0; i <= index; i++) {
    i < 2 ? fibArray.push(i) : fibArray.push(fibArray[i - 1] + fibArray[i - 2]);
  }
  return fibArray[index];
};

console.log(fibCalculate(10));
sub.on("message", (channel, message) => {
  redisClient.hset("values", message, fibCalculate(message * 1));
});

sub.subscribe("insert")
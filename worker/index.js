const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retryStrategy: () => 1000,
});
console.log(keys.redisHost);
console.log(keys.redisPort);
const sub = redisClient.duplicate();
const fibArray = [];
const fibCalculate = (index) => {
  const fibArray = [];
  for (let i = 0; i <= index; i++) {
    i < 2 ? fibArray.push(i) : fibArray.push(fibArray[i - 1] + fibArray[i - 2]);
  }
  return fibArray[index];
};

sub.on("message", (channel, message) => {
  console.log(message);
  console.log("--worker---");
  console.log(typeof message);
  redisClient.hset("values", message, fibCalculate(parseInt(message)));
});

sub.subscribe('insert');

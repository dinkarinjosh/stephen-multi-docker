import keys from "./keys.mjs";
import express from "express";
import cors from "cors";
import pkg from "pg"; // postgress
const {Pool} = pkg;
import redis from "redis";
//Intantiate and apply middlewares
const app = express();
app.use(express.json());
app.use(cors());

// PostGress setup
const pgClient = new Pool({
  host: keys.pgHost,
  port: keys.pgPort,
  database: keys.pgDatabase,
  user: keys.pgUser,
  password: keys.pgPassword,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values(number INT")
    .catch((err) => console.log("Unable to create table " + err));
});

// Redis Client setup

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();
// Express Route handlers;

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * FROM values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetAll("values", (error, values) => {
    res.send(values);
  });
});

app.post("values", async (req, res) => {
  const index = req.body.index * 1;
  index > 40
    ? res.status(422).json({ message: "Index is too high" })
    : redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: "true" });
});

app.listen(5000, () => {
  console.log("listening on the port 5000");
});

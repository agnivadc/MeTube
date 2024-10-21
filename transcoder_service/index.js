// index.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import KafkaConfig from "./kafka/kafka.js";
import convertToHLS from "./hls/transcode.js";
import s3ToS3 from "./hls/s3Tos3.js";

dotenv.config();
const app = express();
const port = 8081;

app.use(
  cors({
    allowedHeaders: ["*"],
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HHLD YouTube Transcoder Consumer");
});

app.get("/transcode", (req, res) => {
  // convertToHLS();
  s3ToS3();
  res.send("Transcoding done!!");
});

// consumer service - transcoder service
// consume data from kafka - index.js
const kafkaconfig = new KafkaConfig();
kafkaconfig.consume("transcode", (value) => {
  console.log("got data from kafka : ", value);
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

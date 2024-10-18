// kafka/kafka.js - all services where you want to use kafka (either produce or consume)
import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";

class KafkaConfig {
  constructor() {
    this.kafka = new Kafka({
      clientId: "youtube uploader",
      brokers: [
        "metube-kafka-16818bde-agnivadutta1995-fd8d.b.aivencloud.com:12317",
      ],
      ssl: {
        ca: [fs.readFileSync(path.resolve("./ca.pem"), "utf-8")],
      },
      sasl: {
        username: "avnadmin",
        password: "AVNS_Q9XbvLWV77ZFya3KMfx",
        mechanism: "plain",
      },
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "youtube-uploader" });
  }

  async produce(topic, messages) {
    try {
      const result = await this.producer.connect();
      console.log("kafka connected... : ", result);
      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic, callback) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
export default KafkaConfig;

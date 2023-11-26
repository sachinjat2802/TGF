/* The RabbitMQConnection class is a JavaScript class that provides methods for
connecting to a RabbitMQ server, sending messages to a queue, and closing the
connection. */
import amqp from "amqplib";
import Buffer from "buffer";

class RabbitMQConnection {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
    }
  }

  async sendToQueue(queue, data) {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();
      this.channel.assertExchange(queue, "fanout", { durable: false });
      this.channel.publish(queue, "", Buffer.from(JSON.stringify(data)));
      console.log(`Sent registration event for ${data.username}`);
      return true;
    } catch (error) {
      console.error("Error sending to RabbitMQ:", error);
    }
  }

  async close() {
    if (this.connection) {
      await this.channel.close();
      await this.connection.close();
    }
  }
}

export default RabbitMQConnection;

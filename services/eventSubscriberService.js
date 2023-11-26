/* The `EventSubscriber` class is a JavaScript class that connects to a RabbitMQ
server, subscribes to a specified queue, and handles incoming events by logging
them using a logger. */
import amqp from "amqplib";
import logger from "../logger.js";
class EventSubscriber {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async subscribe(queue) {
    try {
      this.connection = await amqp.connect("amqp://localhost");
      this.channel = await this.connection.createChannel();
      this.channel.assertExchange(queue, "fanout", { durable: false });
      const assertQueue = await this.channel.assertQueue("", {
        exclusive: true,
      });
      await this.channel.bindQueue(assertQueue.queue, queue, "");
      console.log(" [*] Waiting for events. To exit, press CTRL+C");

      this.channel.consume(
        assertQueue.queue,
        (msg) => {
          this.handleEvent(msg);
        },
        { noAck: true }
      );
    } catch (error) {
      logger.error("Error subscribing to RabbitMQ:", error);
    }
  }

  handleEvent(msg) {
    try {
      const content = msg.content.toString();
      console.log(` [x] Received event: ${content}`);

      // Log the event using the logger from logger.js
      logger.info(content);
    } catch (error) {
      logger.error("Error handling event:", error);
    }
  }
}

export default EventSubscriber;

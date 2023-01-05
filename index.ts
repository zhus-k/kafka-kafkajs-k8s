import { Kafka, logLevel } from "kafkajs";

const main = async () => {
	const kafka = new Kafka({
		// logLevel: logLevel.DEBUG,
		clientId: "my-app",
		brokers: ["localhost:9092"],
	});
	kafka.logger().info("Kafka created");
	const producer = kafka.producer();

	await producer.connect();
	await producer.send({
		topic: "test-topic",
		messages: [{ value: "Hello KafkaJS user!" }],
	});

	await producer.disconnect();

	const consumer = kafka.consumer({ groupId: "test-group" });

	await consumer.connect();
	await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log({
				value: message?.value?.toString(),
			});
		},
	});
};

main();

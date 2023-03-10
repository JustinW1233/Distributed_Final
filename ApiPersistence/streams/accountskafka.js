//install or import the package or library
const {Kafka} = require('kafkajs');
const {KAFKA_USERNAME: username, KAFKA_PASSWORD: password} = process.env;
const sasl = username && password ? {username, password, mechanism: 'plain'} : null;
const ssl = !!sasl;

//create a client connection for the kafka broker
console.log(process.env.KAFKA_BROKER_SERVER)

const kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER_SERVER],
    clientId: 'accounts-consumer', 
    ssl,
    sasl,
})

module.exports = kafka;
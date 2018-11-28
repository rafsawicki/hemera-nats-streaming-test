const Hemera = require('nats-hemera');
const nats = require('nats').connect();
const hemeraNatsStreaming = require('hemera-nats-streaming');
const chalk = require('chalk');

const subscriberName = process.argv[2];
if (subscriberName == null) {
  throw new Error('Missing subscriber name');
}

const hemera = new Hemera(nats, {
  logLevel: 'warn',
});

hemera.use(hemeraNatsStreaming, {
  clusterId: 'test-cluster',
  clientId: subscriberName,
  options: {}, // NATS/STAN options
});

const receivedEventIds = new Set();

hemera.ready(() => {
  hemera.natss.add({
    subject: 'user-created',
    options: {}, // (optional) nats-streaming transport options
    pattern: {}, // (optional) the pattern which arrive hemera
  });

  hemera.add({ topic: 'natss.user-created' }, (msg) => {
    const eventId = msg.data.message.eventId;

    if (receivedEventIds.has(eventId)) {
      console.log(chalk.bold.red(`Received duplicate event with id ${eventId}`));
    } else if (eventId > 1 && !receivedEventIds.has(eventId - 1)) {
      console.log(chalk.bold.yellow(`Received an event with id ${eventId} but previous is missing`));
    } else {
      console.log(`Received an event with id ${eventId}`);
    }

    receivedEventIds.add(eventId);

    return Promise.resolve();
  });
});

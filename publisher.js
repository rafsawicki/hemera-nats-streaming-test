const Hemera = require('nats-hemera');
const nats = require('nats').connect();
const hemeraNatsStreaming = require('hemera-nats-streaming');

const hemera = new Hemera(nats, {
  logLevel: 'warn',
});

hemera.use(hemeraNatsStreaming, {
  clusterId: 'test-cluster',
  clientId: 'publisher',
  options: {}, // NATS/STAN options
});

let eventId = 1;
hemera.ready(() => {
  setInterval(async () => {
    console.log('publisher: Publishing an event with id', eventId);
    await hemera.act({
      topic: 'natss',
      cmd: 'publish',
      subject: 'user-created',
      data: { eventId: eventId },
    });
    eventId += 1;
  }, 3000);
});

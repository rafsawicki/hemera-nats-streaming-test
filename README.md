This code is demonstrating event handling issues with hemera-nats-streaming plugin. To reproduce, first launch a nats streaming instance via:

```bash
docker run -d -p 4222:4222 -p 8222:8222 nats-streaming 
```

Alternatively change the configuration in `publisher.js` and `subscriber.js` files to point it to a existing nats streaming server.

Then launch publisher and 3 subscriber instances using:

```bash
npm start
```

Scripts will continue to run until any handler receives the same event twice or there is a gap in an event sequence number.

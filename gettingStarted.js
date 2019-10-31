require('dotenv').config()
const Ioredis = require('ioredis');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  if (!process.env.REDIS_HOST) {
    throw Error('You should first fill the .env-example file and rename it to .env');
  }

  // Connect to Redis server
  console.log();
  console.log('🔌  Connecting to Redis...');
  console.log();

  const redis = new Ioredis({
    host: process.env.REDIS_HOST,
    port: 6380, // This is the TLS port (communications will be encrypted)
    password: process.env.REDIS_PASSWORD,
    db: 0,
    tls: {} // To activate TLS support (encryption)
  });

  // This is a good practice to close Redis connection when the Node.js process receives the signal "TERM".
  process.once('SIGTERM', () => redis.disconnect());


  // SET/GET/DEL examples
  console.log('-'.repeat(80));
  console.log('🌟 SET/GET/DEL examples');
  console.log();

  console.log(`➡️  Setting key "stackhero-example-key" to value "abcd"`);
  await redis.set('stackhero-example-key', 'abcd');
  console.log();

  console.log(`➡️  Getting key "stackhero-example-key" value...`);
  const value = await redis.get('stackhero-example-key');
  console.log(`⬅️  Key "stackhero-example-key" has value "${value}"`);
  console.log();

  console.log('➡️  Deleting key "stackhero-example-key"');
  await redis.del('stackhero-example-key');
  console.log();


  // SADD/SMEMBERS examples
  console.log('-'.repeat(80));
  console.log('🌟 SADD/SMEMBERS examples');
  console.log();

  console.log(`➡️  Add values "value1", "value2" and "value3" to the set key "stackhero-example-set"`);
  await redis.sadd('stackhero-example-set', [ 'value1', 'value2', 'value3' ]);
  console.log();

  console.log(`➡️  Getting members from the set key "stackhero-example-set"`);
  const values = await redis.smembers('stackhero-example-set');
  console.log(`⬅️  Set key "stackhero-example-set" has values "${values}"`);
  console.log();


  // PUB/SUB examples
  console.log('-'.repeat(80));
  console.log('🌟 PUB/SUB examples');
  console.log();

  console.log(`➡️  [redis] Subscribing to "users" and "events"`);
  await redis.subscribe([ 'users', 'events' ]);
  console.log();

  // Listening to messages
  redis.on('message', (channel, message) => {
    console.log(`⬅️  [redis] Receive message "${message}" from channel "${channel}"`);
    console.log();
  });


  // As we "subscribe" to channels, our "redis" client can't be use anymore for other commands than SUBSCRIBE, PSUBSCRIBE, UNSUBSCRIBE, PUNSUBSCRIBE, PING and QUIT.
  // We create a new "redisPub" client with the same connection options from the "redis" one.
  const redisPub = redis.duplicate();

  // This is a good practice to close Redis connection when the Node.js process receives the signal "TERM".
  process.once('SIGTERM', () => redisPub.disconnect());


  console.log(`➡️  [redisPub] Sending message to channel "users"`);
  await redisPub.publish('users', 'I\'m a new user!');
  // We wait 200ms to be sure than the message has been received. It just for the demo, to have the "Sending message" and "Receive message" one after the other.
  await delay(200);

  console.log(`➡️  [redisPub] Sending message to channel "events"`);
  await redisPub.publish('events', 'Here is a new event!');
  // We wait 200ms to be sure than the message has been received. It just for the demo, to have the "Sending message" and "Receive message" one after the other.
  await delay(200);




  console.log('-'.repeat(80));
  console.log('👋 Disconnecting "redis" and "redisPub" clients');
  await redis.disconnect();
  await redisPub.disconnect();
  console.log();


  // console.log(`➡️  Sending to "users" and "messages"`);
  // redis.publish('', "Hello world!");


  // // ADD PUB/SUB EXAMPLES
  // redis.subscribe("news", "music", function(err, count) {
  //   // Now we are subscribed to both the 'news' and 'music' channels.
  //   // `count` represents the number of channels we are currently subscribed to.

  //   pub.publish("news", "Hello world!");
  //   pub.publish("music", "Hello again!");
  // });

  // redis.on("message", function(channel, message) {
  //   // Receive message Hello world! from channel news
  //   // Receive message Hello again! from channel music
  //   console.log("Receive message %s from channel %s", message, channel);
  // });

  // // There's also an event called 'messageBuffer', which is the same as 'message' except
  // // it returns buffers instead of strings.
  // redis.on("messageBuffer", function(channel, message) {
  //   // Both `channel` and `message` are buffers.
  // });


  // You will get a lot of others examples on the ioredis repository: https://github.com/luin/ioredis
})().catch(error => {
  console.error('');
  console.error('🐞 An error occurred!');
  console.error(error);
  process.exit(1);
});
# Redis getting started

## How to send data from Node.js to Redis

You can find here some examples of Node.js code to send data to a Redis server.

These examples are designed to run with a Stackhero Redis service.
You'll more informations about Stackhero here:
- [Redis cloud](https://www.stackhero.io/en/services/Redis/benefits)
- [Redis pricing](https://www.stackhero.io/en/services/Redis/pricing)
- [Redis documentations](https://www.stackhero.io/en/services/Redis/documentations)


## How to use

- First, clone this repository: `git clone https://github.com/stackhero-io/redisGettingStarted.git && cd redisGettingStarted`
- Then, install nodes packages: `npm install`
- Copy the file `.env-example` to `.env` and fill it with your credentials
- Finally, start the first example: `node gettingStarted.js`

This example use the `ioredis` library.
You will find documentation on the official [Github repository](https://github.com/luin/ioredis)

![screenshot](screenshot.png)
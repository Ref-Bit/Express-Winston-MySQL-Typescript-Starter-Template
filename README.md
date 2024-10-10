# Express + Winston + MySQL + Typescript Starter Template

## Description

This template created for quicker supports the following tools:

* [cors](https://github.com/expressjs/cors#readme) - Enable CORS with various options on your server.
* [dotenv](https://github.com/motdotla/dotenv#readme) - zero-dependency module that loads environment variables.
* [expressjs](http://expressjs.com) - Fast, unopinionated, minimalist web framework for Node.js.
* [helmet](https://helmetjs.github.io) - Helps you secure your Express apps by setting various HTTP headers.
* [mysql2](https://sidorares.github.io/node-mysql2/docs) - fast mysql driver. Implements core protocol, prepared statements, ssl and compression in native JS.
* [morgan](https://github.com/expressjs/morgan#readme) - HTTP request logger middleware for node.js.
* [winston](https://github.com/winstonjs/winston#readme) - A logger for just about everything (with daily log files rotation).

### Get Started

Create environment variables file

```bash
cp .env.example .env
```

Create logs directory in the root project

```bash
mkdir logs
```

Install node modules

```bash
pnpm
```

Build the src folder

```bash
pnpm build
```

Start the project

```bash
pnpm dev
```

### Notes

Make sure to `%j` at the end of the logger to print your object variable properly.

```ts
logger.info("My Object %j", myObj);
```

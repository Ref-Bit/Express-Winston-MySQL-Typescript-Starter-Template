import morgan, { StreamOptions } from "morgan";
import { addColors, createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "../config/server.config";

const { combine, colorize, timestamp, splat, metadata, printf, errors } =
  format;

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = config.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "info";
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
addColors(colors);

const customFormat = printf(({ timestamp, level, message, metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (metadata && Object.keys(metadata).length) {
    msg += ` ${JSON.stringify(metadata, null, 2)}`;
  }
  return msg;
});

// Chose the aspect of your log customizing the log format.
const logFormat = combine(
  // Add the message timestamp with the preferred format
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  // Add the error stack trace if the message is an error
  errors({ stack: true }),
  // Define the Metadata format
  metadata({ fillExcept: ["message", "level", "timestamp", "stack"] }),
  // Enables string interpolation <https://nodejs.org/dist/latest/docs/api/util.html#util_util_format_format_args>
  splat(),
  // Define the format of the message showing the timestamp, the level and the message
  customFormat
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const logTransports = [
  // Allow the use the console to print the messages
  new transports.Console({
    // Tell Winston that the logs must be colored
    format: combine(colorize(), logFormat),
  }),
  // Allow to print all the error message inside the all.log file
  // (also the error log that are also printed inside the error.log)
  new DailyRotateFile({
    dirname: config.LOGS_DIR,
    filename: `${config.APP_NAME}-%DATE%-all.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "5m",
    maxFiles: "7d",
    level: level(),
  }),
];

// Create the logger instance that has to be exported
// and used to log messages
const logger = createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports: logTransports,
});

const stream: StreamOptions = {
  // Use the http severity
  write: (message) => logger.http(message),
};

const skip = () => {
  const env = config.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream,
    skip,
  }
);

export { logger, morganMiddleware as morgan };

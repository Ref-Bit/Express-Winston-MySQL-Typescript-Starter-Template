import * as dotenv from "dotenv";
import path from "path";

// Parsing the env file
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  dotenv.config();
} else {
  dotenv.config({ path: path.join(__dirname, "../../.env") });
}

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these variables or not setup a .env file at all

interface ENV {
  NODE_ENV: string | undefined;
  PORT: number | undefined;
  APP_NAME: string | undefined;
  LOGS_DIR: string | undefined;
  DB_HOST: string | undefined;
  DB_PORT: number | undefined;
  DB_USER: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_NAME: string | undefined;
}

interface Config {
  NODE_ENV: string;
  PORT: number;
  APP_NAME: string;
  LOGS_DIR: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  const env = process.env;

  return {
    NODE_ENV: env.NODE_ENV || "development",
    PORT: env.PORT ? Number(env.PORT) : undefined,
    APP_NAME: env.APP_NAME,
    LOGS_DIR: env.LOGS_DIR || "logs",
    DB_HOST: env.DB_HOST,
    DB_PORT: Number(env.DB_PORT),
    DB_USER: env.DB_USER,
    DB_PASSWORD: env.DB_PASSWORD,
    DB_NAME: env.DB_NAME,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition

const getSanitizedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env file`);
    }
  }
  return config as Config;
};

export const config = getSanitizedConfig(getConfig());

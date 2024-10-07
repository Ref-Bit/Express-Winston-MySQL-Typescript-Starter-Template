import express, { Express, json, urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";

import { config } from "./config/server.config";
import APIRoutes from "./routes/index.route";
import { logger, morgan } from "./utils/logger.utils";

const app: Express = express();
const PORT = config.PORT;

app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(morgan);

app.use("/api", APIRoutes);

app.listen(PORT, () => {
  logger.info(`[⚡️] Server is running at http://localhost:${PORT}`);
});

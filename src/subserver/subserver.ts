import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import indexRouter from "../../router/index"; // Adjust the path if needed
import {
  globalErrorHandler,
  notFoundHandler,
} from "../../middleware/errorHandler";
import bodyParser from "body-parser";

const createApp = (): Express => {
  const app = express();
  // Middleware
  app.use(cors());
  app.use(morgan("dev"));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/api", indexRouter);
  app.use(globalErrorHandler);
  app.use(notFoundHandler);

  return app;
};

export default createApp;

import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import indexRouter from "../../router/index"; // Adjust the path if needed

const createApp = (): Express => {
  const app = express();
  // Middleware
  app.use(cors());
  app.use(morgan("dev"));
  // Routes
  app.use("/api", indexRouter);

  return app;
};

export default createApp;

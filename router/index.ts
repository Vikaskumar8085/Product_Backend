import express from "express";
import userRouter from "./UserRouter";

const indexRouter = express.Router();

indexRouter.use("/user", userRouter);

export default indexRouter;

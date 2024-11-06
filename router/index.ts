import express from "express";
import userRouter from "./UserRouter";
import productRouter from "./ProductRouter";

const indexRouter = express.Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/product", productRouter);

export default indexRouter;

import express from "express";
import userRouter from "./UserRouter";
import candidateRouter from "./CandidateRouter";
import designationRouter from "./DesignationRouter";
import ReasonRouter from "./ReasonRouter";
const indexRouter = express.Router();
indexRouter.use("/user", userRouter);
indexRouter.use("/designation", designationRouter);
indexRouter.use("/candidate", candidateRouter);
indexRouter.use("/reason", ReasonRouter);
export default indexRouter;

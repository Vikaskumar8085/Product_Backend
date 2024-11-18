import express from "express";
import ReasonCtr from "../../../controller/ReasonController/ReasonCtr";

const ReasonRouter = express.Router();

ReasonRouter.post("/create-reason", ReasonCtr.createReasonctr);
export default ReasonRouter;

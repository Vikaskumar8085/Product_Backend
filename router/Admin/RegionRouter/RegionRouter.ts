import express from "express";
import RegionCtr from "../../../controller/RegionController/RegionCtr";

const regionRouter = express.Router();

regionRouter.post("/create-region", RegionCtr.createRegionctr);
regionRouter.get("/fetch-region",RegionCtr.fetchregionctr)

export default regionRouter;

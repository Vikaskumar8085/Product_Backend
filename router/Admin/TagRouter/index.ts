import {Router} from "express";
import TagCtr from "../../../controller/TagsController/TagCtr";

const tagRouter = Router();

// tag Router
tagRouter.post("/create-tag", TagCtr.createtagCtr);
tagRouter.get("/fetch-tag", TagCtr.fetchtagsCtr);

export default tagRouter;

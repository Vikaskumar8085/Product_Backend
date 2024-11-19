import {Router} from "express";
import TagCtr from "../../../controller/TagsController/TagCtr";
import upload from "../../../middleware/upload";
const tagRouter = Router();

// tag Router
tagRouter.post("/create-tag", TagCtr.createtagCtr);
tagRouter.get("/fetch-tag", TagCtr.fetchtagsCtr);
tagRouter.post("/import-tags",upload.single("file"), TagCtr.importTagsCtr);
tagRouter.get("/download-tag-template", TagCtr.returntagsCsvFile);

export default tagRouter;

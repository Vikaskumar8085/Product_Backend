import express from "express";
import DesignationCtr from "../../../controller/DesignationController/DesignationCtr";
const designationRouter = express.Router();

designationRouter.post("/create-designation", DesignationCtr.createdesignationctr);
designationRouter.get("/fetch-designation", DesignationCtr.fetchdesignationCtr);
designationRouter.delete("/delete-designation/:id", DesignationCtr.reomvedesignationCtr);
designationRouter.put("/update-designation/:id", DesignationCtr.editdesignationCtr);


export default designationRouter;

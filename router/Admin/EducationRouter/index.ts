import express from "express";
import EducationCtr from "../../../controller/EducationController/EducationCtr";

const educationRouter = express.Router();

educationRouter.post("/create-education", EducationCtr.createEducationctr);
export default educationRouter;

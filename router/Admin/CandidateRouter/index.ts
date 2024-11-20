import express, {Request, Response} from "express";
import CandidateCtr from "../../../controller/CandidateController/CandidateCtr";
import upload from "../../../middleware/upload";
import verifyToken from "../../../middleware/auth/Verifytoken";
const candidateRouter = express.Router();

candidateRouter.post("/create-candidate",verifyToken, CandidateCtr.createCandidatectr);
candidateRouter.get("/fetch-candidate", CandidateCtr.fetchCandidateCtr);
candidateRouter.delete("/delete-candidate/:id", CandidateCtr.reomveCandidateCtr);
candidateRouter.put("/update-candidate/:id", CandidateCtr.editCandidateCtr);
candidateRouter.post("/upload-csv-candidate", upload.single("file"), CandidateCtr.importCandidates);
candidateRouter.get("/download-csv-candidate", CandidateCtr.returnCandidateCsvFile);

export default candidateRouter;
import express, {Request, Response} from "express";
import AnalyticalCtr from "../../../controller/AnalyticalController";
import verifyToken from "../../../middleware/auth/Verifytoken";

const analyticalRouter = express.Router();

analyticalRouter.get("/candidate-distribution", AnalyticalCtr.candidateDistribution);
analyticalRouter.get("/work-experience-analysis",verifyToken, AnalyticalCtr.workExperienceAnalysis);
analyticalRouter.get("/current-ctc-analysis", AnalyticalCtr.currentCTCAnalysis);
analyticalRouter.get("/geographical-distribution",verifyToken, AnalyticalCtr.geographicalDistribution);
analyticalRouter.get("/education-level-analysis", AnalyticalCtr.educationLevelAnalysis);
analyticalRouter.get("/reasons-for-leaving-analysis", AnalyticalCtr.reasonsForLeaving);
analyticalRouter.get("/client-analysis", AnalyticalCtr.clientStatusAnalysis);
analyticalRouter.get("/tag-analysis", AnalyticalCtr.tagAnalysis);
analyticalRouter.get("/candidate-age-distribution", AnalyticalCtr.candidateAgeDistribution);


export default analyticalRouter;
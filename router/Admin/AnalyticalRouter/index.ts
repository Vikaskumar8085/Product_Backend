import express, {Request, Response} from "express";
import AnalyticalCtr from "../../../controller/AnalyticalController";

const analyticalRouter = express.Router();

analyticalRouter.get("/candidate-distribution", AnalyticalCtr.candidateDistribution);
analyticalRouter.get("/work-experience-analysis", AnalyticalCtr.workExperienceAnalysis);
analyticalRouter.get("/current-ctc-analysis", AnalyticalCtr.currentCTCAnalysis);
analyticalRouter.get("/geographical-distribution", AnalyticalCtr.geographicalDistribution);
analyticalRouter.get("/education-level-analysis", AnalyticalCtr.educationLevelAnalysis);
analyticalRouter.get("/reasons-for-leaving-analysis", AnalyticalCtr.reasonsForLeaving);
analyticalRouter.get("/tag-analysis", AnalyticalCtr.tagAnalysis);
analyticalRouter.get("/client-analysis", AnalyticalCtr.clientStatusAnalysis);
analyticalRouter.get("/candidate-age-distribution", AnalyticalCtr.candidateAgeDistribution);
analyticalRouter.get("/client-distribution", AnalyticalCtr.clientDistribution);

export default analyticalRouter;
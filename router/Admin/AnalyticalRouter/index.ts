import express, {Request, Response} from "express";
import AnalyticalCtr from "../../../controller/AnalyticalController";
import verifyToken from "../../../middleware/auth/Verifytoken";
import answerCandidateController from "../../../controller/AnalyticalController/reason";

const analyticalRouter = express.Router();

analyticalRouter.get("/candidate-distribution", AnalyticalCtr.candidateDistribution);
analyticalRouter.get("/work-experience-analysis",verifyToken, AnalyticalCtr.workExperienceAnalysis);
analyticalRouter.get("/current-ctc-analysis", AnalyticalCtr.currentCTCAnalysis);
analyticalRouter.get("/geographical-distribution",verifyToken, AnalyticalCtr.geographicalDistribution);
analyticalRouter.get("/education-level-analysis", AnalyticalCtr.educationLevelAnalysis);
analyticalRouter.get("/client-analysis", AnalyticalCtr.clientStatusAnalysis);
analyticalRouter.get("/tag-analysis", AnalyticalCtr.tagAnalysis);
analyticalRouter.get("/candidate-age-distribution", AnalyticalCtr.candidateAgeDistribution);

analyticalRouter.get('/answers/distribution', answerCandidateController.getAnswerDistribution);
analyticalRouter.get('/answers/combinations', answerCandidateController.getCommonAnswerCombinations);
analyticalRouter.get('/answers/demographics', answerCandidateController.getAnswersByDemographics);
analyticalRouter.get('/answers/trends', answerCandidateController.getAnswerTrends);
analyticalRouter.get('/answers/candidate-stats', answerCandidateController.getCandidateStatsPerAnswer);
analyticalRouter.get('/answers/by-experience', answerCandidateController.getAnswersByExperience);


export default analyticalRouter;
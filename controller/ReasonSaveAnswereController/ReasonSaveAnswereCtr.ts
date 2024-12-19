import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import ReasonSaveAnswer from "../../modals/ReasonSaveAnswer/ReasonSaveAnswer";

const ReasonSaveAnswerCtr = {
  create: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {candidateId, questionId, answer} = req.body;
        const reasonSaveAnswer = await ReasonSaveAnswer.create({
          candidateId,
          questionId,
          answer,
        });

        if (!reasonSaveAnswer) {
          res.status(400);
          throw new Error("bad Request");
        }

        return res.status(200).json({
          message: "successfully created ",
          result: reasonSaveAnswer,
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default ReasonSaveAnswerCtr;

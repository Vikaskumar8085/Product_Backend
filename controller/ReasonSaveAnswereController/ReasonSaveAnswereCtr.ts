import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import ReasonSaveAnswer from "../../modals/ReasonSaveAnswer/ReasonSaveAnswer";

const ReasonSaveAnswerCtr = {
  create: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {candidateId, questionId, answer} = req.body;
        if (questionId.length !== answer.length) {
          res.status(400);
          throw new Error(
            "questionId and answer arrays must have the same length."
          );
        }

        // Prepare the data for bulk insert
        const responseData = questionId.map((qid: number, index: number) => ({
          candidateId: parseInt(candidateId, 10), // Ensure `candidateId` is an integer
          questionId: qid,
          answer: answer[index],
        }));

        const reasonSaveAnswer = await ReasonSaveAnswer.bulkCreate(
          responseData
        );

        if (!reasonSaveAnswer) {
          res.status(400);
          throw new Error("Bad Request");
        }

        res.status(200).json({
          success: true,
          message: "Answers saved successfully",
          result: reasonSaveAnswer,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default ReasonSaveAnswerCtr;

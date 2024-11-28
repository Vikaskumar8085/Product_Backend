import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import User from "../../modals/User/User";
import {StatusCodes} from "http-status-codes";
import ClientSecurity from "../../modals/ClientSecurity/ClientSecurity";
import bcrypt from "bcryptjs";
import UserSecurityAnswer from "../../modals/UserSecurityAnswer/index";
import SecurityQuestion from "../../modals/SecurityQuestions/index";
const clientsecurityctr = {
  //  add clien security data
  setSecurityQueAnsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // Ensure the user exists
        const checkUser = await User.findByPk(req.user.id);
        if (!checkUser) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("User Not Found");
        }
  
        const { questionsAndAnswers } = req.body;
        
        if (!Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Invalid input. Expected an array of question and answer pairs.");
        }
  
        for (const { questionId, answer } of questionsAndAnswers) {
          // Validate that the question exists in the SecurityQuestion table
          const securityQuestion = await SecurityQuestion.findByPk(questionId);
          if (!securityQuestion) {
            throw new Error(`Security question with ID ${questionId} not found`);
          }
  
          // Hash the answer using bcrypt
          const hashedAnswer = await bcrypt.hash(answer, 10);
  
          // Check if the user already has an answer for this question
          const existingAnswer = await UserSecurityAnswer.findOne({
            where: {
              userId: req.user.id,
              questionId,
            },
          });
  
          if (existingAnswer) {
            // If an answer exists, update it
            existingAnswer.answerHash = hashedAnswer;
            await existingAnswer.save();
          } else {
            // If no answer exists, create a new record
            await UserSecurityAnswer.create({
              userId: req.user.id,
              questionId,
              answerHash: hashedAnswer,
            });
          }
        }
  
        // Send success response
        res.status(StatusCodes.OK).json({
          message: "Security questions and answers set successfully",
          success: true,
        });
      } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error?.message || "Something went wrong",
        });
      }
    }
  ),
  

  //   fetch  client security data
  fetchclientsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const fetchsecurity = await ClientSecurity.findAll();

        if (!fetchsecurity || fetchsecurity.length === 0) {
          return res.status(StatusCodes.NOT_FOUND).json({
            message: "No security data found.",
            success: false,
          });
        }

        return res.status(StatusCodes.OK).json({
          message: "Security data fetched successfully.",
          success: true,
          result: fetchsecurity,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   remove client security data
  removeclientsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // remove security
        const removeSecurity = await ClientSecurity.findByPk(req.params.id);

        if (!removeSecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Security entry not found.");
        }

        await removeSecurity.destroy();

        return res.status(StatusCodes.OK).json({
          message: "Security entry removed successfully.",
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   edity client security data

  updateclientsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      const {ClientId, QuestionId, Answer} = req.body;
      // Validate required fields
      if (!ClientId || !QuestionId || !Answer) {
        res.status(StatusCodes.BAD_REQUEST);
        throw new Error("ClientId, QuestionId, and Answer are required.");
      }

      try {
        const updateSecurity = await ClientSecurity.findByPk(req.params.id);

        if (!updateSecurity) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Security entry not found.");
        }

        await updateSecurity.update({ClientId, QuestionId, Answer});

        return res.status(StatusCodes.OK).json({
          message: "Client Security entry updated successfully.",
          success: true,
          result: updateSecurity,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};

export default clientsecurityctr;

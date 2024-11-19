import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import Education from "../../modals/Eduction/Education";
import {StatusCodes} from "http-status-codes";

const EducationCtr = {
  // create Education ctr
  createEducationctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {ugCourse, pgCourse, postPgCourse, candidateId} = req.body;
        const response = await Education.create({
          ugCourse,
          pgCourse,
          postPgCourse,
          candidateId,
        });
        if (!response) {
          res.status;
          throw new Error("education Not Found");
        }
        return res.status(StatusCodes.CREATED).json({
          message: "education created successfully",
          success: true,
          result: response,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   fetch education ctr

  fetchEducationctr: asyncHandler(async (req: CustomRequest, res: Response) => {
    try {
      const response = await Education.findAll();
      if (!response) {
      }
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
};

export default EducationCtr;

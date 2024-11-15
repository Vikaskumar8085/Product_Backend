import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";

const EducationCtr = {
  // create Education ctr
  createEducationctr: asyncHandler(
    async (req: CustomRequest, res: Response) => {
      try {
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   fetch education ctr

  fetchEducationctr: asyncHandler(async (req: CustomRequest, res: Response) => {
    try {

    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
};


export default EducationCtr;
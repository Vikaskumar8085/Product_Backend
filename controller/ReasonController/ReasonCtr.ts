import {Response} from "express";
import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {StatusCodes} from "http-status-codes";
import ReasonsForLeaving from "../../modals/ReasonForLeaving/ReasonForLeaving";
import ReasonAnswer from "../../modals/ReasonAnswer/ReasonAnswer";
const ReasonCtr = {
  //   create reason ctr
  createReasonctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {reason, option} = req.body;
        const data = await option.map((item: any) => {
          return item;
        });
        console.log("////", data);
        console.log(reason, option);
        const additem = await ReasonsForLeaving.create({
          reason,
        });

        if (!additem) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Reason Not Found");
        }

        const reasonAnswers = option.map((optionText: any) => ({
          reason_id: additem.id, // Associate the reason ID to the options
          Reason_answer: optionText,
        }));

        // Bulk create the ReasonAnswer entries
        await ReasonAnswer.bulkCreate(reasonAnswers);

        return res
          .status(StatusCodes.OK)
          .json({message: "Reason Created", success: true, result: additem});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //fetch reason Ctr
  fetchReasonCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const fetchitmes = await ReasonsForLeaving.findAll({
          include: {model: ReasonAnswer, attributes: ["Reason_answer"]},
        });

        if (!fetchitmes) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Reason not found");
        }
        return res
          .status(StatusCodes.OK)
          .json({message: "", success: true, result: fetchitmes});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   remove reson ctr
  removeReasonCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const removeitem = await ReasonsForLeaving.findByPk(req.params.id);
        if (!removeitem) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Reason not found ");
        } else {
          await removeitem.destroy();
        }
        return res
          .status(StatusCodes.OK)
          .json({message: "Reason removed successfully", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   edit reason ctr
  updateReasonCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const checkitems = await ReasonsForLeaving.findByPk(req.params.id);
        if (!checkitems) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Reason not found ");
        }
        await checkitems.update({reason: req.body.reason});
        return res.status(StatusCodes.OK).json({
          message: "updated successfully",
          success: true,
          result: checkitems,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};
export default ReasonCtr;

import {Response} from "express";
import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {StatusCodes} from "http-status-codes";
import ReasonsForLeaving from "../../modals/ReasonForLeaving/ReasonForLeaving";
const ReasonCtr = {
  //   create reason ctr
  createReasonctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const additem = await ReasonsForLeaving.create({
          reason: req.body.reason,
        });

        if (!additem) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("Reason Not Found");
        }
        return res
          .status(StatusCodes.OK)
          .json({message: "Reason Created", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //fetch reason Ctr

  fetchReasonCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const fetchitmes = await ReasonsForLeaving.findAll();
        if (!fetchitmes) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
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
          throw new Error("");
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
          throw new Error("");
        }
        await checkitems.update({reason: req.body.reason});
        return res
          .status(StatusCodes.OK)
          .json({message: "updated successfully", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};
export default ReasonCtr;

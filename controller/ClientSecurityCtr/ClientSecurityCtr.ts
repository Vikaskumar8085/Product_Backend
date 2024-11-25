import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import User from "../../modals/User/User";
import {StatusCodes} from "http-status-codes";
import ClientSecurity from "../../modals/ClientSecurity/ClientSecurity";
const clientsecurityctr = {
  //  add clien security data
  createclientsecurity: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      const {ClientId, QuestionId, Answer} = req.body;
      try {
        // user Exists
        const userExists: number | unknown = await User.findByPk(req.user);
        if (!userExists) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("User Not Found Please Login !");
        }

        // Validate required fields
        if (!ClientId || !QuestionId || !Answer) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            message: "ClientId, QuestionId, and Answer are required.",
            success: false,
          });
        }

        const addsecurity = await ClientSecurity.create({
          ClientId,
          QuestionId,
          Answer,
        });

        return res.status(StatusCodes.CREATED).json({
          message: "Security entry added successfully.",
          success: true,
          result: addsecurity,
        });
      } catch (error: any) {
        throw new Error(error?.message);
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

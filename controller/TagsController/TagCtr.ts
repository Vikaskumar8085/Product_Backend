import asyncHandler from "express-async-handler";
import {CustomRequest} from "../../typeReq/customReq";
import {Response} from "express";
import User from "../../modals/User/User";
import {StatusCodes} from "http-status-codes";
import Tag from "../../modals/Tag/Tag";

const TagCtr = {
  // create tags
  createtagCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const {Tag_Name} = req.body;

        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }
        if (!Tag_Name || typeof Tag_Name !== "string") {
          return res
            .status(400)
            .json({error: "Tag_Name is required and must be a string."});
        }

        const additmes = await Tag.create({Tag_Name});
        if (!additmes) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("tag not found");
        }
        return res.status(StatusCodes.CREATED).json({
          message: "Tag created successfully",
          success: true,
          result: additmes,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   fetch tags
  fetchtagsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check User existance
        // const userExists: number | unknown = await User.findByPk(req.user);
        // if (!userExists) {
        //   res.status(404);
        //   throw new Error("User Not Found Please Login !");
        // }

        const fetchitmes = await Tag.findAll();
        if (!fetchitmes) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        }
        return res.status(StatusCodes.OK).json({
          message: "tags fetch successfully",
          success: true,
          result: fetchitmes,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   remove tags

  removetagsCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check User existance
        const userExists: number | unknown = await User.findByPk(req.user);
        if (!userExists) {
          res.status(404);
          throw new Error("User Not Found Please Login !");
        }

        const checktags = await Tag.findByPk(req.params.id);
        if (!checktags) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        } else {
          await checktags.destroy();
        }
        return res
          .status(StatusCodes.OK)
          .json({message: "remove items successfully", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //    edit tags ctr
  updatetagctr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // check User existance
        const userExists: number | unknown = await User.findByPk(req.user);
        if (!userExists) {
          res.status(404);
          throw new Error("User Not Found Please Login !");
        }
        const checktags = await Tag.findByPk(req.params.id);
        if (!checktags) {
          res.status(StatusCodes.NOT_FOUND);
          throw new Error("");
        } else {
          await checktags.update({Tag_Name: req.body.Tag_Name});
        }
        return res
          .status(StatusCodes.OK)
          .json({message: "tag updated successfully", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),

  //   imported Tags
};

export default TagCtr;

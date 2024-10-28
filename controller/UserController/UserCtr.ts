import { Response, Request } from "express";

const asyncHandler = require("express-async-handler");

const UserCtr = {
  // Register ctr
  registerCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  //   SignIn Ctr
  loginCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
};

module.exports = UserCtr;

import { Response, Request } from "express";
const asyncHandler = require("express-async-handler");
import User from "../../modals/User/User";
import { where } from "sequelize";

const UserCtr = {
  // Register ctr
  registerCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
      const { FirstName, LastName, Email, Phone } = req.body;
      const hashpassword = "w3";
      const response = await User.create({
        FirstName,
        LastName,
        Email,
        Password: hashpassword,
        Phone,
      });

      if (!response) {
        res.status(400);
        throw new Error("User Not Found");
      }
      return res.status(201).json({
        message: "registration successfully completed",
        status: "success",
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  //   SignIn Ctr
  loginCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
      const response = await User.findOne({
        where: { Email: req.body.Email, Password: req.body.Password },
      });
      if (!response) {
        res.status(400);
        throw new Error("User Not Found Please Sign in");
      }

      const token = "asdf";
      return res.status(200).json({
        message: "Login Successfully",
        result: token,
        status: "success",
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  // logout Ctr
  logoutCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
      return res
        .status(200)
        .json({ message: "successfully logout", status: "success" });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  // Profile Ctr
  profileCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  // forget Ctr
  forgetpasswordCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  // Reset token
  resetpasswordCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  // Change Password Ctr
  changePasswordCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
};

module.exports = UserCtr;

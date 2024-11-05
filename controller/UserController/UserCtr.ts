import {Response, Request, NextFunction} from "express";
import asyncHandler from "express-async-handler";
import User from "../../modals/User/User";
import bcrypt from "bcryptjs";
import generateToken from "../../middleware/auth/generateToken";

const UserCtr = {
  // Register ctr
  registerCtr: asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      try {
        let {FirstName, LastName, Email, Phone, Password} = req.body;

        const hashpassword = await bcrypt.hash(Password, 10);
        Password = hashpassword;
        const response = await User.create({
          FirstName,
          LastName,
          Email,
          Password,
          Phone,
        });

        if (!response) {
          res.status(400);
          throw new Error("User Not Found");
        }
        return res.status(201).json({
          message: "registration successfully completed",
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  //   SignIn Ctr
  loginCtr: asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await User.findOne({
        where: {Email: req.body.Email},
      });
      // console.log(response, "response backend");
      if (!response) {
        res.status(400);
        throw new Error("User Not Found Please Sign in");
      }

      // compare password
      const checkpassword = await bcrypt.compare(
        req.body.Password,
        response.Password
      );
      // check password

      if (!checkpassword) {
        res.status(400);
        throw new Error("User and Password Not Found");
      }
      // generate token
      const token = await generateToken(response.id);
      return res.status(200).json({
        message: "Login Successfully",
        result: token,
        success: true,
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  // logout Ctr
  logoutCtr: asyncHandler(async (req: Request, res: Response): Promise<any> => {
    try {
      return res
        .status(200)
        .json({message: "Successfully logged out", status: "success"});
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "An error occurred during logout",
        status: "error",
      });
    }
  }),

  // Profile Ctr
  profileCtr: asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      try {
        const response = await User.findAndCountAll();

        if (!response) {
          res.status(400);
          throw new Error("User Not Found Please Sign in");
        }
        return res.status(200).json({
          message: "successfully fetch data",
          status: "success",
          result: response,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  // forget Ctr
  forgetpasswordCtr: asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      try {
        const response = await User.findOne({
          where: {Email: req.body.Email},
        });
        if (!response) {
          res.status(400);
          throw new Error("User Not Found Please enter correct Email Address");
        }
        console.log(response, "response");
        return res
          .status(200)
          .json({message: "Please check your Email ", success: true});
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
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

export default UserCtr;

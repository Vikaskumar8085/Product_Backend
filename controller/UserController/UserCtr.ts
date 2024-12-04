import {Response, Request, NextFunction} from "express";
import asyncHandler from "express-async-handler";
import User from "../../modals/User/User";
import Token from "../../modals/Token/Token";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateToken from "../../middleware/auth/generateToken";
import SendMail from "../../utils/SendMail";
import {CustomRequest} from "../../typeReq/customReq";
import dotenv from "dotenv";
import {Op} from "sequelize";
import {StatusCodes} from "http-status-codes";
import UserSecurityAnswer from "../../modals/UserSecurityAnswer/index";
import SecurityQuestion from "../../modals/SecurityQuestions/index";
dotenv.config();

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
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        // const response = await User.findByPk(req.user.id);
        //exclude password
        const response = await User.findOne({
          where: {id: req.user.id},
          attributes: {exclude: ["Password"]},
        });
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

  getUserCtr: asyncHandler(
    async (req: CustomRequest, res: Response): Promise<any> => {
      try {
        const response = await User.findByPk(req.user.id);

        if (!response) {
          res.status(StatusCodes.BAD_REQUEST);
          throw new Error("Bad request");
        }

       
       
        return res.status(StatusCodes.OK).json({
          message: "User fetched",result: response,success: true,
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
        console.log(req.body);
        const response = await User.findOne({
          where: {Email: req.body.Email},
        });
        if (!response) {
          res.status(400);
          throw new Error("User Not Found Please enter correct Email Address");
        }
        let resetToken = crypto.randomBytes(32).toString("hex") + response.id;
        console.log(resetToken);

        // Hash token before saving to DB
        const hashedToken = crypto
          .createHash("sha256")
          .update(resetToken)
          .digest("hex");
        // Delete token if it exists in DB
        console.log("forget hashed", hashedToken);
        let token = await Token.findOne({
          where: {userId: response.id},
        });

        if (token) {
          await token.destroy();
        }

        await Token.create({
          userId: response.id,
          token: hashedToken,
          createdAt: new Date(),
          expireAt: new Date(Date.now() + 30 * 60 * 1000), // Thirty minutes
        });

        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

        const message = `
      <h2>Hello ${response.FirstName}</h2>
      <p>Please use the url below to reset your password</p>
      <p>This reset link is valid for only 30minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards...</p>
      <p>Ignitive Team</p>
    `;
        const subject = "Password Reset Request";
        const send_to = response.Email;
        console.log("send_to", send_to, "message", message, "subject", subject);
        await SendMail({subject, message, send_to});

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
      const {password} = req.body;
      const {resetToken} = req.params;

      // Hash token, then compare to Token in DB
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // fIND tOKEN in DB
      console.log(hashedToken, "hashedToken");
      const userToken = await Token.findOne({
        where: {
          token: hashedToken,
          expireAt: {
            [Op.gt]: new Date(), // checks if expireAt is greater than current date
          },
        },
      });
      //token not matched i think we need to compare that

      if (!userToken) {
        res.status(404);
        throw new Error("Invalid or Expired Token");
      }
      // Find user
      const user = await User.findOne({where: {id: userToken.userId}});
      const hashpassword = await bcrypt.hash(password, 10);
      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }
      user.Password = hashpassword;
      await user.save();
      res.status(200).json({
        message: "Password Reset Successful, Please Login Again",
      });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  // Change Password Ctr
  changePasswordCtr: asyncHandler(async (req: CustomRequest, res: Response) => {
    try {
      const {oldPassword, Password} = req.body;
      const user = await User.findOne({where: {id: req.user.id}});

      if (!user) {
        res.status(401);
        throw new Error("User not found, please signup");
      }
      if (!oldPassword || !Password) {
        res.status(400);
        throw new Error("Please add old and new password");
      }

      // check if old password matches password in DB
      const passwordIsCorrect = await bcrypt.compare(
        oldPassword,
        user.Password
      );
      // Save new password
      if (user && passwordIsCorrect) {
        const hashpassword = await bcrypt.hash(Password, 10);
        user.Password = hashpassword;
        await user.save();
        res.status(200).send("Password change successful ");
      }
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
  editprofileCtr: asyncHandler(async (req: CustomRequest, res: Response) => {
    try {
      const {FirstName, LastName, Email, Phone} = req.body;
      const user = await User.findOne({where: {id: req.user.id}});

      if (!user) {
        res.status(401);
        throw new Error("User not found");
      }

      if (!FirstName || !LastName || !Email || !Phone) {
        res.status(400);
        throw new Error("Please provide all required fields");
      }

      user.FirstName = FirstName;
      user.LastName = LastName;
      user.Email = Email;
      user.Phone = Phone;

      // Handle uploaded image
      if (req.file) {
        console.log("images",req.file);
        user.ProfileImage = `/uploads/profileImages/${req.file.filename}`;
      }

      await user.save();
      //exclude password
      
      res.status(200).json({
        message: "Profile updated successfully",
        success: true,
        result: user,
      });
    } catch (error: any) {
      res.status(500).json({error: error.message});
    }
  }),
  
};

export default UserCtr;

import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

const verifytoken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split("").join(",");
    console.log(token);
  } catch (error: any) {
    throw new Error(error?.message);
  }
};

export default verifytoken;

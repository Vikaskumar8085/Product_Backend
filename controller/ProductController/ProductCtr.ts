import { Response, Request } from "express";
const asyncHandler = require("express-async-handler");

const ProductCtr = {
  createProductCtr: asyncHandler(async (req: Request, res: Response) => {
    try {
    } catch (error: any) {
      throw new Error(error?.message);
    }
  }),
};
export default ProductCtr;

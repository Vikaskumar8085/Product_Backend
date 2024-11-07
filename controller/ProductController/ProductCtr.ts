import {Response, Request} from "express";
import Product from "../../modals/Product/Product";
const asyncHandler = require("express-async-handler");

const ProductCtr = {
  createProductCtr: asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      try {
        let {
          Candidate_Name,
          Resume_Title,
          Contact_Number,
          Email,
          Work_Exp,
          Current_Ctc,
          Salary,
          Current_Location,
          State,
          Region,
          UserId,
        } = req.body;
        const response: any | null = await Product.create({
          Candidate_Name,
          Resume_Title,
          Contact_Number,
          Email,
          Work_Exp,
          Current_Ctc,
          Salary,
          Current_Location,
          State,
          Region,
          UserId,
        });

        if (!response) {
          res.status(400);
          throw new Error("Product Not Found");
        }
        return res.status(201).json({
          message: "Product created successfully",
          success: true,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
  getProductCtr: asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      try {
        const response: any | null = await Product.findAll();
        if (!response) {
          res.status(400);
          throw new Error("Product Not Found");
        }
        return res.status(200).json({
          message: "Product fetched successfully",
          success: true,
          data: response,
        });
      } catch (error: any) {
        throw new Error(error?.message);
      }
    }
  ),
};
export default ProductCtr;

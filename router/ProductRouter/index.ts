import express, {Request, Response} from "express";
import verifyToken from "../../middleware/auth/Verifytoken";
const productRouter = express.Router();

productRouter.get(
  "/fetch-product",
  verifyToken,
  async (req: Request, res: Response) => {
    console.log("hello");
  }
);

export default productRouter;

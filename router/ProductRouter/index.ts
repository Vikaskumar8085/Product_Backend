import express from "express";
import ProductCtr from "../../controller/ProductController/ProductCtr";
const productRouter = express.Router();

productRouter.post("/create", ProductCtr.createProductCtr);
productRouter.get("/get", ProductCtr.getProductCtr);


export default productRouter;

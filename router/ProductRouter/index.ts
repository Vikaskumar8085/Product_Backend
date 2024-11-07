import express from "express";
import ProductCtr from "../../controller/ProductController/ProductCtr";
const productRouter = express.Router();

productRouter.post("/add-product", ProductCtr.createProductCtr);
productRouter.get("/fetch-product", ProductCtr.getProductCtr);

export default productRouter;

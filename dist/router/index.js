"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRouter_1 = __importDefault(require("./UserRouter"));
const ProductRouter_1 = __importDefault(require("./ProductRouter"));
const indexRouter = express_1.default.Router();
indexRouter.use("/user", UserRouter_1.default);
indexRouter.use("/product", ProductRouter_1.default);
exports.default = indexRouter;

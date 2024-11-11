"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const subserver_1 = __importDefault(require("./subserver/subserver"));
const Product_1 = __importDefault(require("../modals/Product/Product"));
const User_1 = __importDefault(require("../modals/User/User"));
const Token_1 = __importDefault(require("../modals/Token/Token"));
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const app = (0, subserver_1.default)();
// sequelize
//   .sync()
//   .then(() => {
//     console.log("connection established");
//   })
//   .catch((error: any) => {
//     console.error(error.message);
//   });
const db = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User_1.default.sync();
        yield Product_1.default.sync();
        yield Token_1.default.sync();
        console.log("connection established");
    }
    catch (error) {
        console.error(error.message);
    }
});
db();
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

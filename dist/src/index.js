"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const subserver_1 = __importDefault(require("./subserver/subserver"));
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const app = (0, subserver_1.default)();
app.listen(port, () => {
    console.log(`Server started on PORT ${port}`);
});

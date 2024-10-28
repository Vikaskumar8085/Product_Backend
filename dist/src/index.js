"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const subserver_1 = __importDefault(require("./subserver/subserver"));
const dbconfig_1 = __importDefault(require("../dbconfig/dbconfig"));
dotenv_1.default.config();
const port = process.env.PORT || 4000;
const app = (0, subserver_1.default)();
dbconfig_1.default
    .sync()
    .then(() => {
    console.log("connection established");
})
    .catch((error) => {
    console.error(error.message);
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

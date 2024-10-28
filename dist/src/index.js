"use strict";
// import dotenv from "dotenv";
// import createApp from "./subserver/subserver";
// import sequelize, { connectToDatabase } from "../dbconfig/dbconfig";
// dotenv.config();
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
// const port = process.env.PORT || 4000;
// const app = createApp();
// const runTestQuery = async () => {
//   try {
//     // Example raw SQL query
//     const [results, metadata] = await sequelize.query(
//       "SELECT * FROM some_table;"
//     );
//     console.log("Query Results:", results);
//   } catch (error) {
//     console.error("Error executing query:", error);
//   }
// };
// export default runTestQuery;
// const startServer = async () => {
//   await connectToDatabase(); // Connect to the database
//   await runTestQuery(); // Run a test query
//   app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//     console.log("me");
//   });
// };
// startServer();
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const dbconfig_1 = require("../dbconfig/dbconfig");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, dbconfig_1.connectToDatabase)(); // Connect to the database
    yield (0, dbconfig_1.runRawQuery)(); // Run a test query
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});
startServer();

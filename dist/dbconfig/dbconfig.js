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
exports.runRawQuery = exports.connectToDatabase = void 0;
// src/db.ts
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Initialize Sequelize connection
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "mysql",
    logging: false, // Enable logging for SQL queries if needed
});
// Function to authenticate the database connection
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Connected to the MySQL database on XAMPP successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
});
exports.connectToDatabase = connectToDatabase;
const runRawQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Example raw SQL query to fetch data from a table named 'test_table'
        const [results, metadata] = yield sequelize.query("SELECT * FROM test_table;");
        console.log("Query Results:", results);
    }
    catch (error) {
        console.error("Error executing query:", error);
    }
});
exports.runRawQuery = runRawQuery;
// Export the Sequelize instance for running raw queries
exports.default = sequelize;

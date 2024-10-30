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
const asyncHandler = require("express-async-handler");
const User_1 = __importDefault(require("../../modals/User/User"));
const UserCtr = {
    // Register ctr
    registerCtr: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { FirstName, LastName, Email, Phone } = req.body;
            const hashpassword = "w3";
            const response = yield User_1.default.create({
                FirstName,
                LastName,
                Email,
                Password: hashpassword,
                Phone,
            });
            if (!response) {
                res.status(400);
                throw new Error("User Not Found");
            }
            return res.status(201).json({
                message: "registration successfully completed",
                status: "success",
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //   SignIn Ctr
    loginCtr: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield User_1.default.findOne({
                where: { Email: req.body.Email, Password: req.body.Password },
            });
            if (!response) {
                res.status(400);
                throw new Error("User Not Found Please Sign in");
            }
            const token = "asdf";
            return res.status(200).json({
                message: "Login Successfully",
                result: token,
                status: "success",
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // logout
    logoutCtr: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return res
                .status(200)
                .json({ message: "successfully logout", status: "success" });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    //
    forgetpasswordCtr: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // Reset token
    resetTokenCtr: asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
module.exports = UserCtr;

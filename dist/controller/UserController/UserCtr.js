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
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../../modals/User/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = __importDefault(require("../../middleware/auth/generateToken"));
const UserCtr = {
    // Register ctr
    registerCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let { FirstName, LastName, Email, Phone, Password } = req.body;
            const hashpassword = yield bcrypt_1.default.genSalt(10, Password);
            Password = hashpassword;
            const response = yield User_1.default.create({
                FirstName,
                LastName,
                Email,
                Password,
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
    loginCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield User_1.default.findOne({
                where: { Email: req.body.Email, Password: req.body.Password },
            });
            if (!response) {
                res.status(400);
                throw new Error("User Not Found Please Sign in");
            }
            const token = yield (0, generateToken_1.default)(response.id);
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
    // logout Ctr
    logoutCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return res
                .status(200)
                .json({ message: "Successfully logged out", status: "success" });
        }
        catch (error) {
            res.status(500).json({
                message: error.message || "An error occurred during logout",
                status: "error",
            });
        }
    })),
    // Profile Ctr
    profileCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield User_1.default.findAndCountAll();
            if (!response) {
                res.status(400);
                throw new Error("User Not Found Please Sign in");
            }
            return res.status(200).json({
                message: "successfully fetch data",
                status: "success",
                result: response,
            });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // forget Ctr
    forgetpasswordCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield User_1.default.findOne({
                where: { Email: req.body.Email },
            });
            if (!response) {
                res.status(400);
                throw new Error("Your Email Not Found");
            }
            return res
                .status(200)
                .json({ message: "Please check your Email ", status: "success" });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // Reset token
    resetpasswordCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
    // Change Password Ctr
    changePasswordCtr: (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    })),
};
exports.default = UserCtr;

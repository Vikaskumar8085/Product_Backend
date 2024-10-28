"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("../../router/index")); // Adjust the path if needed
const createApp = () => {
    const app = (0, express_1.default)();
    // Middleware
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    // Routes
    app.use("/api", index_1.default);
    return app;
};
exports.default = createApp;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = require("jsonwebtoken");
;
const adminModel = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
});
adminModel.methods.generateAuthToken = function () {
    const token = (0, jsonwebtoken_1.sign)({ _id: this._id }, process.env.jwtPrivateKey, { expiresIn: process.env.expiresAt });
    return {
        token: token
    };
};
const Admin = mongoose_1.default.model('Admin', adminModel);
exports.default = Admin;

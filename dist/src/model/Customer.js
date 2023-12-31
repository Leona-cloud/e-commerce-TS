"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = require("jsonwebtoken");
;
const customerModel = new mongoose_1.default.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    altAddress: {
        type: String,
        required: true
    },
});
customerModel.methods.generateAuthToken = function () {
    const token = (0, jsonwebtoken_1.sign)({ _id: this._id }, process.env.jwtPrivateKey, { expiresIn: process.env.expiresAt });
    return {
        token: token
    };
};
const Customer = mongoose_1.default.model('Customer', customerModel);
exports.default = Customer;

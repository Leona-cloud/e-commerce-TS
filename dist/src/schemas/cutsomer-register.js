"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validate = function validateCustomer(user) {
    const schema = joi_1.default.object({
        userName: joi_1.default.string().required().min(6).max(12),
        email: joi_1.default.string().required().trim().lowercase().email(),
        password: joi_1.default.string().required().min(6).max(12),
        phoneNumber: joi_1.default.string().length(11).pattern(/^[0-9]+$/).required(),
        address: joi_1.default.string().required(),
        altAddress: joi_1.default.string().required(),
    });
    const options = {
        abortEarly: false,
    };
    return schema.validate(user, options);
};
exports.default = validate;

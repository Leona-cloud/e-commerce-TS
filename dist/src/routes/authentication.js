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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Customer_1 = __importDefault(require("../model/Customer"));
const cutsomer_register_1 = __importDefault(require("../schemas/cutsomer-register"));
const lodash_1 = __importDefault(require("lodash"));
const AuthRouter = (0, express_1.Router)();
AuthRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, cutsomer_register_1.default)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const { email, userName, password, phoneNumber, address, altAddress } = req.body;
    let customer = yield Customer_1.default.findOne({ email: email });
    if (customer)
        return res.status(400).json({
            success: false,
            message: 'Customer already registered'
        });
    customer = new Customer_1.default({
        email: email,
        password: password,
        userName: userName,
        phoneNumber: phoneNumber,
        address: address,
        altAddress: altAddress
    });
    const salt = yield bcrypt_1.default.genSalt(10);
    customer.password = yield bcrypt_1.default.hash(customer.password, salt);
    try {
        const result = yield customer.save();
        console.log(result, 'here');
        return res.status(200).json({
            success: true,
            message: 'Customer registered successfully',
            data: {
                user: (lodash_1.default.pick(customer, ['_id', 'userName', 'email', 'phoneNumber']))
            }
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - user registration failed'
        });
    }
}));
AuthRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let user = yield Customer_1.default.findOne({ email: email });
        if (!user)
            return res.status(400).json({
                success: false,
                message: `user with email - ${email} does not exist`
            });
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!isValidPassword)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        return res.status(200).json({
            success: true,
            message: 'user logged in successfully',
            data: Object.assign({}, user.generateAuthToken())
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - user login failed'
        });
    }
}));
exports.default = AuthRouter;

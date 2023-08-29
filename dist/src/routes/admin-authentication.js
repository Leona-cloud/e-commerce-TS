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
const admin_register_1 = __importDefault(require("../schemas/admin-register"));
const admin_1 = __importDefault(require("../model/admin"));
const AdminAuthRouter = (0, express_1.Router)();
AdminAuthRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, admin_register_1.default)(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;
    let adminExists = yield admin_1.default.findOne({ email: email });
    if (adminExists)
        return res.status(400).json({
            success: false,
            message: 'Admin already registered'
        });
    adminExists = new admin_1.default({
        email: email,
        password: password
    });
    const salt = yield bcrypt_1.default.genSalt(10);
    adminExists.password = yield bcrypt_1.default.hash(adminExists.password, salt);
    try {
        const result = yield adminExists.save();
        console.log(result, 'here');
        return res.status(200).json({
            success: true,
            message: 'Admin registered successfully',
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - admin registration failed'
        });
    }
}));
AdminAuthRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let admin = yield admin_1.default.findOne({ email: email });
        if (!admin)
            return res.status(400).json({
                success: false,
                message: `admin with email - ${email} does not exist`
            });
        const isValidPassword = yield bcrypt_1.default.compare(password, admin.password);
        if (!isValidPassword)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        return res.status(200).json({
            success: true,
            message: 'admin logged in successfully',
            data: Object.assign({}, admin.generateAuthToken())
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - admin login failed'
        });
    }
}));
exports.default = AdminAuthRouter;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const admin_1 = __importDefault(require("../model/admin"));
dotenv.config();
const AdminAuth = function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.header('Bearer');
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Access denied, user unauthorized"
            });
        }
        ;
        try {
            const decode = jsonwebtoken_1.default.verify(token, process.env.jwtPrivateKey);
            console.log(decode);
            const admin = yield admin_1.default.findOne({ _id: decode._id });
            if (admin) {
                req.user = decode;
                next();
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'User access forbidden'
                });
            }
        }
        catch (ex) {
            console.log(ex.message);
            return res.status(401).json({
                success: false,
                message: "Invalid token or token expired"
            });
        }
    });
};
exports.default = AdminAuth;

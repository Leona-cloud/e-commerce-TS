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
const lodash_1 = __importDefault(require("lodash"));
const product_1 = __importDefault(require("../model/product"));
const admin_auth_1 = __importDefault(require("../middleware/admin-auth"));
const ProductRouter = (0, express_1.Router)();
ProductRouter.post('/create', admin_auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new product_1.default(lodash_1.default.pick(req.body, ['productName', 'description', 'brand', 'price', 'countInStock']));
    try {
        const result = yield product.save();
        res.status(200).json({
            success: true,
            message: "product created successfully",
            data: {
                product
            }
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - product creation failed'
        });
    }
}));
ProductRouter.put("/update/:id", admin_auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product = yield product_1.default.findOne({ id: req.params.id });
        if (!product)
            return res.status(400).json({
                success: false,
                message: "product not found!!!"
            });
        yield product.updateOne({ _id: product._id }, { new: true }).set({
            price: req.body.price,
            countInStock: req.body.countInStock
        });
        return res.json({
            success: true,
            message: "product updated successfully",
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - update product failed'
        });
    }
}));
exports.default = ProductRouter;

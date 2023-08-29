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
const product_1 = __importDefault(require("../model/product"));
const order_1 = __importDefault(require("../model/order"));
const customer_auth_1 = __importDefault(require("../middleware/customer-auth"));
const admin_auth_1 = __importDefault(require("../middleware/admin-auth"));
const OrderRouter = (0, express_1.Router)();
OrderRouter.post('/create', customer_auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUser = req.user;
    const { productId, country, city, shippingAddress } = req.body;
    const productExists = yield product_1.default.findOne({ _id: productId });
    console.log(productExists);
    if (!productExists)
        return res.status(400).json({
            success: false,
            message: 'Product does not exist'
        });
    const productPrice = productExists.price;
    const createOrder = new order_1.default({
        shippingAddress: shippingAddress,
        city: city,
        country: country,
        totalPrice: productPrice,
        customerId: authenticatedUser._id,
        productId: productExists._id
    });
    try {
        const result = yield createOrder.save();
        return res.status(200).json({
            success: false,
            message: 'Order created successfully',
            data: {
                result
            }
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - order creation failed'
        });
    }
}));
OrderRouter.get('/fetch-orders', admin_auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page;
    const pageSize = 5;
    let pageNumber;
    if (page === undefined) {
        pageNumber = 0;
    }
    else {
        pageNumber = Number(page) - 1;
    }
    ;
    const pagination = pageNumber * pageSize;
    console.log(pagination);
    try {
        const fetchOrders = yield order_1.default.find().sort({ createdAt: -1 }).limit(pageSize).skip(pagination);
        return res.status(200).json({
            success: true,
            message: "orders retrieved successfully",
            data: {
                fetchOrders
            }
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - fetch orders failed'
        });
    }
}));
OrderRouter.post('/filter', admin_auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { upperBound, lowerBound, page } = req.body;
    const pageSize = 5;
    let pageNumber;
    if (page === undefined) {
        pageNumber = 0;
    }
    else {
        pageNumber = Number(page) - 1;
    }
    ;
    const pagination = pageNumber * pageSize;
    try {
        const filterOrders = yield order_1.default.find({ totalPrice: { $gte: lowerBound, $lt: upperBound } }).sort({ totalPrice: -1 }).limit(pageSize).skip(pagination);
        return res.status(200).json({
            success: true,
            message: 'orders retrieved successfully',
            data: {
                filterOrders
            }
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - filter orders failed'
        });
    }
}));
exports.default = OrderRouter;

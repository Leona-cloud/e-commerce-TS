"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const customer_authentication_1 = __importDefault(require("./src/routes/customer-authentication"));
const admin_authentication_1 = __importDefault(require("./src/routes/admin-authentication"));
const create_products_1 = __importDefault(require("./src/routes/create-products"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth/customer', customer_authentication_1.default);
app.use('/api/auth/admin', admin_authentication_1.default);
app.use('/api/product', create_products_1.default);
mongoose_1.default.connect(process.env.DB_CONNECT)
    .then(() => console.log("connected to db" + '' + `${process.env.DB_CONNECT}`))
    .catch((err) => console.error("unable to connect", err));
const port = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

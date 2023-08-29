import { Request, Response, Router } from "express";
import _ from 'lodash';
import Product from "../model/product";
import Order from "../model/order";
import CustomerAuth from "../middleware/customer-auth";
import AdminAuth from "../middleware/admin-auth";


const OrderRouter: Router = Router();


OrderRouter.post('/create', CustomerAuth, async (req: Request, res: Response) => {

    const authenticatedUser = req.user

    const { productId, country, city, shippingAddress } = req.body;

    //check if product exists
    const productExists = await Product.findOne({ _id: productId });
    console.log(productExists)
    if (!productExists) return res.status(400).json({
        success: false,
        message: 'Product does not exist'
    });

    //if product exists get price
    const productPrice = productExists.price

    //create order
    const createOrder = new Order({
        shippingAddress: shippingAddress,
        city: city,
        country: country,
        totalPrice: productPrice,
        customerId: authenticatedUser._id,
        productId: productExists._id
    });
    try {

        const result = await createOrder.save()

        return res.status(200).json({
            success: false,
            message: 'Order created successfully',
            data: {
                result
            }
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - order creation failed'
        })

    }

});

// get all orders

OrderRouter.get('/fetch-orders', AdminAuth, async (req: Request, res: Response) => {

    const page = req.query.page;

    const pageSize = 5;

    let pageNumber;
    if (page === undefined) {
        pageNumber = 0;
    } else {
        pageNumber = Number(page) - 1;
    };

    const pagination = pageNumber * pageSize;
    console.log(pagination)

    try {
        const fetchOrders = await Order.find().sort({ createdAt: -1 }).limit(pageSize).skip(pagination);
        return res.status(200).json({
            success: true,
            message: "orders retrieved successfully",
            data: {
                fetchOrders
            }
        })
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - fetch orders failed'
        })
    }


});


//filter and sort based on price

OrderRouter.post('/filter', AdminAuth, async (req: Request, res: Response) => {

    const { upperBound, lowerBound, page } = req.body;


    const pageSize = 5;

    let pageNumber;
    if (page === undefined) {
        pageNumber = 0;
    } else {
        pageNumber = Number(page) - 1;
    };

    const pagination = pageNumber * pageSize;



    try {

        const filterOrders = await Order.find({ totalPrice: { $gte: lowerBound, $lt: upperBound } }).sort({ totalPrice: -1 }).limit(pageSize).skip(pagination);

        return res.status(200).json({
            success: true,
            message: 'orders retrieved successfully',
            data: {
                filterOrders
            }
        })
        
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - filter orders failed'
        })
    }


});


export default OrderRouter
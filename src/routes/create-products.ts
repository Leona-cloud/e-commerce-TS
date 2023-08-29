import { Request, Response, Router } from "express";
import _ from 'lodash';
import Product from "../model/product";
import AdminAuth from "../middleware/admin-auth";



const ProductRouter: Router = Router();


ProductRouter.post('/create', AdminAuth, async (req: Request, res: Response) => {

    const product = new Product(_.pick(req.body, ['productName', 'description', 'brand', 'price', 'countInStock']));

    try {
        const result = await product.save();
        res.status(200).json({
            success: true,
            message: "product created successfully",
            data: {
                product
            }
        })
    } catch (error: any) {

        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - product creation failed'
        })

    }



});


ProductRouter.put("/update/:id", AdminAuth, async (req: Request, res: Response) => {

    try {

        let product = await Product.findOne({ id: req.params.id});

        if (!product) return res.status(400).json({
            success: false,
            message: "product not found!!!"
        });

        await product.updateOne({_id: product._id}, { new: true }).set({
            price: req.body.price,
            countInStock: req.body.countInStock
        })

        return res.json({
            success: true,
            message: "product updated successfully",
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - update product failed'
        })

    }




});


export default ProductRouter
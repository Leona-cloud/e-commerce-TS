import mongoose, { Mongoose } from "mongoose";


export interface Product extends mongoose.Document{

    productName: string,
    description: string,
    brand: string,
    price: Number,
    countInStock: Number

};


const productSchema: mongoose.Schema<Product> = new mongoose.Schema({

    productName: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    
    brand: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,
    },

    countInStock: {
        type: Number,
        required: true
    }

}, {timestamps: true});


const Product = mongoose.model<Product>('Product', productSchema);


export default Product;
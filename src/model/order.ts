import mongoose, { Mongoose } from "mongoose";
import { Types } from "mongoose";

export interface Order extends mongoose.Document{
    shippingAddress: string,
    city: string,
    country: string,
    status: string,
    totalPrice: number,
    customerId: Types.ObjectId
    productId: Types.ObjectId

};


const orderSchema: mongoose.Schema<Order> = new mongoose.Schema({

    shippingAddress: {
        type: String,
        required : true
    },
    city: {
        type: String,
        required : true
    },
    country: {
        type:String,
        required:  true
    },
    status: {
        type: String,
        default : 'pending'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    customerId :{ 
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    productId: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }

}, {timestamps: true});



const Order = mongoose.model<Order>('Order', orderSchema);


export default Order;
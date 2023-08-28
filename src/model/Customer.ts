import mongoose from "mongoose";
import { sign } from 'jsonwebtoken';
import Joi, { number } from 'joi';

export interface Customer extends mongoose.Document {
    userName: string,
    email: string,
    password: string,
    phoneNumber: string,
    address: string,
    altAddress: string,
    generateAuthToken: () => { token: string; expires: number };
};


const customerModel: mongoose.Schema<Customer> = new mongoose.Schema({


    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    altAddress: {
        type: String,
        required: true
    },

});

customerModel.methods.generateAuthToken  = function(){
    const token: string = sign({_id: this._id}, process.env.jwtPrivateKey as string, { expiresIn: process.env.expiresAt });
    return {
        token: token
    };
};



const Customer = mongoose.model<Customer>('Customer', customerModel);


export default Customer;
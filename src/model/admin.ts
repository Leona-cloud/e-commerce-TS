import mongoose from "mongoose";
import { sign } from 'jsonwebtoken';
import Joi, { number } from 'joi';


export interface Admin extends mongoose.Document {
    email: string,
    password: string,
    isAdmin: boolean
    generateAuthToken: () => { token: string; expires: number };
};


const adminModel: mongoose.Schema<Admin> = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    }


});


adminModel.methods.generateAuthToken  = function(){
    const token: string = sign({_id: this._id}, process.env.jwtPrivateKey as string, { expiresIn: process.env.expiresAt });
    return {
        token: token
    };
};



const Admin = mongoose.model<Admin>('Admin', adminModel);


export default Admin;

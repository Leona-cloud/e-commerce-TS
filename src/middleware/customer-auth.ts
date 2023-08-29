import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import {Request, Response, NextFunction} from 'express';
import Customer from '../model/Customer';

dotenv.config();

interface JwtPayload {
    _id: string
  }


const CustomerAuth = async function auth(req: Request, res: Response, next: NextFunction){
    const token = req.header('Bearer');
    if(!token){
        return res.status(400).json({
            success: false,
            message: "Access denied, user unauthorized"
        })
    };

    try {
        const decode = jwt.verify(token, process.env.jwtPrivateKey as string) as JwtPayload;
        const customer = await Customer.findOne({_id: decode._id});
        if(customer){
            req.user = decode;
            next();
        }else{
            return res.status(401).json({
                success: false,
                message: 'User access forbidden'
              })

        }
     
    } catch (ex: any) {
        console.log(ex.message);
        return res.status(401).json({
            success: false,
            message: "Invalid token or token expired"
        });
    }
};


export default CustomerAuth;
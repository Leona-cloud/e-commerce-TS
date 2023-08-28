import { Request, Response, Router}  from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Customer from '../model/Customer';
import validate from '../schemas/cutsomer-register';
import _  from 'lodash'


const AuthRouter: Router = Router();



AuthRouter.post('/register',async (req: Request, res: Response) => {

    const { error }  = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);


    const {email, userName, password, phoneNumber, address, altAddress} = req.body

    let customer = await Customer.findOne({email: email});
    if(customer) return res.status(400).json({
        success: false,
        message: 'Customer already registered'
    });


    customer = new Customer({
        email: email,
        password: password,
        userName: userName,
        phoneNumber: phoneNumber,
        address: address,
        altAddress: altAddress
    });


    const salt =  await bcrypt.genSalt(10);
    customer.password = await bcrypt.hash(customer.password, salt);

    try {

        const result = await customer.save();
        console.log(result, 'here');

        return res.status(200).json({
            success: true,
            message: 'Customer registered successfully',
            data: {
                user: (_.pick(customer, ['_id', 'userName', 'email', 'phoneNumber']))
            }
        })
        
    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - user registration failed'
        })
    }


    
});


AuthRouter.post('/login',async (req: Request, res: Response) => {

    const { email, password } = req.body

    try {


        let user = await Customer.findOne({email: email});
        if(!user) return res.status(400).json({
            success: false,
            message: `user with email - ${email} does not exist`
        });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });

        return res.status(200).json({
            success: true,
            message: 'user logged in successfully',
            data: {
                ...user.generateAuthToken()
            }
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - user login failed'
        })
    }
    
})


export default AuthRouter;
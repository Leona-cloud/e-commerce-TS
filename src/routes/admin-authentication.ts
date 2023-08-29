import { Request, Response, Router}  from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validateAdmin from '../schemas/admin-register';
import Admin from '../model/admin';


const AdminAuthRouter: Router = Router();


AdminAuthRouter.post('/register',async (req: Request, res: Response) => {
    
    const { error }  = validateAdmin(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;

    let adminExists = await Admin.findOne({email: email});
    if(adminExists) return res.status(400).json({
        success: false,
        message: 'Admin already registered'
    });

    adminExists = new Admin({
        email: email,
        password: password
    });

    const salt =  await bcrypt.genSalt(10);
    adminExists.password = await bcrypt.hash(adminExists.password, salt);

    try {
        const result = await adminExists.save();
        console.log(result, 'here');

        return res.status(200).json({
            success: true,
            message: 'Admin registered successfully',
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - admin registration failed'
        })
        
    }
    
});




AdminAuthRouter.post('/login',async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        let admin = await Admin.findOne({email: email});
        if(!admin) return res.status(400).json({
            success: false,
            message: `admin with email - ${email} does not exist`
        });

        const isValidPassword = await bcrypt.compare(password, admin.password);
        if(!isValidPassword) return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });

        return res.status(200).json({
            success: true,
            message: 'admin logged in successfully',
            data: {
                ...admin.generateAuthToken()
            }
        })
        
    } catch (error: any) {

        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal server error - admin login failed'
        })
        
    }
    
});



export default AdminAuthRouter;
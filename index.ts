import express, { Request, Response } from 'express';
import 'dotenv/config'
import  mongoose from 'mongoose';
import AuthRouter from './src/routes/customer-authentication';
import AdminAuthRouter from './src/routes/admin-authentication';
import ProductRouter from './src/routes/create-products';
import OrderRouter from './src/routes/create-order';


const app =  express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//routes
app.use('/api/auth/customer', AuthRouter);
app.use('/api/auth/admin', AdminAuthRouter);
app.use('/api/product', ProductRouter);
app.use('/api/order', OrderRouter)


// connect to db

mongoose.connect(process.env.DB_CONNECT!) 
.then(() => console.log("connected to db" + '' + `${process.env.DB_CONNECT}`))
.catch((err) => console.error("unable to connect", err));



const port = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
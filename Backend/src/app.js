import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// routes import
import authRouter from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));


//  basic check
app.get('/',(req,res)=>{
    res.send("Hnn bhai sabb ok hai");
});

//  using routers
app.use("/api/auth",authRouter);


export default app;
import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from "cors";
import { config } from '../src/config/config.js';

//  setup for google oauth
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// routes import
import authRouter from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
//  cors handle
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}));

//  passport using

app.use(passport.initialize());
passport.use(new GoogleStrategy({
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL:"/api/auth/google/callback",
}, 
(accessToken,refreshToken,profile,done)=>{
    return done(null,profile);
}));

//  basic check
app.get('/',(req,res)=>{
    res.send("Hnn bhai sabb ok hai");
});

//  using routers
app.use("/api/auth",authRouter);


export default app;
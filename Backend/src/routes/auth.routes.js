import { Router } from "express";
import { validateRegisterUser,validateLoginUser } from "../validator/auth.validator.js";
import {register,login,googleAuthController} from '../controller/auth.controller.js';

const router = Router();

/*
post - api/auth/register
for register a new user.
*/
router.post('/register', validateRegisterUser , register );

/*
post - api/auth/login
for login a user.
*/
router.post('/login', validateLoginUser , login );


//  google oauth routes here 

router.get("/google", passport.authenticate("google",{
    scope:["profile","email"]
}));

router.get("/google/callback", passport.authenticate("google",{
    session:false,
    failureRedirect:"http://localhost:5173/login",  
}),googleAuthController);



export default router;
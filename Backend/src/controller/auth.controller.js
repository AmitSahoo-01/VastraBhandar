import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";

//  This is an additional function that is used to generate a token and send it to the client and it is also reusable you can use it multiple time where you want.

async function sendTokenResponse(user,res,message){
    const token = jwt.sign({
        id:user._id,
    },config.JWT_SECRET,{
        expiresIn: "7d"
    });

    res.cookie("token",token);

    return res.status(200).json({
        success:true,
        message,
        token,
        user:{
            id:user._id,
            fullname:user.fullname,
            email:user.email,
            contact:user.contact,
            role:user.role
        },
    });
}

//  This is the controller of register a user
export const register = async (req,res)=>{
    const {contact , password ,fullname,email,isSeller} = req.body;

    try{
        const existingUser = await userModel.findOne({
            $or:[
                {contact},
                {email}
            ]
        });

        if(existingUser){
            return res.status(400).json({
                message:"User already exists",
                success:false
            })
        };

        const user = await userModel.create({
            fullname,
            email,
            password,
            contact,
            role: isSeller ? "seller" : "buyer"
        });

        await sendTokenResponse(user,res,"Registered Hoo gaya Tera Bhai");



    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message:"Kuch toh gadbad hai re bhai register par(server error)",
            success:false
        })
    }

    
}

//  This is the controller for login a user.
export const login = async (req,res) => {
    const {email,password} = req.body;

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"Aree bhai login se pahle register toh kar(User not found)"
            });
        }
        const isPassword = await user.comparePassword(password);
        if(!isPassword){
            return res.status(401).json({
                message:"Arre bhai password toh sahi se daall de(password Invalid)"
            });
        }
       
        await sendTokenResponse(user,res,"login hoo gaya bhai jaa enjoy kar!(login sucessfully)");

    }catch(error){
        console.error("Error in Login controller: ",error);
        return res.status(500).json({
            message:"Server pe gadbad hai re bhai login par(Server error)",
            success:false
        });
    }
}

//  Google auth controller
export const googleAuthController = async(req,res)=>{
    try{
        const {id,displayName,emails,photos} = req.user;
        const email = emails[0].value;
        const profilePic = photos[0].value;

        let user = await userModel.findOne({email});

        if(!user){
            user = await userModel.create({
                email,
                googleId:id,
                fullname:displayName,
            });
        };

        const token = jwt.sign({
            id: user._id
        }, config.JWT_SECRET, {expiresIn:'7d'});

        res.cookie('token', token);

        res.redirect(`http://localhost:5173/`);

    }
    catch(error){
        console.error("Error during google auth:", error);
        res.status(500).json({message:"Internal Server Error"});    
    }
}


//   getMe controller for access the login user details

export const getMe = async (req,res)=>{
    const user = req.user;

    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }

    return res.status(200).json({
        message:"User fetched successfully",
        success:true,
        user
    });
}
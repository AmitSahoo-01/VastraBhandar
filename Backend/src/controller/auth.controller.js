import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";

//  This is an additional function that is used to generate a token and send it to the client and it is also reusable you can use it multiple time where you want.

async function sendTokenResponse(user,message,res){
    const token = jwt.sign({
        id:user._id,
    },config.JWT_SECRET,{
        expiresIn: "7d"
    });

    res.cookie("token",token);

    res.status(200).json({
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

        await sendTokenResponse(user,"Registered Hoo gaya Tera Bhai",res);



    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message:"Kuch toh gadbad hai re bhai(server error)",
            success:false
        })
    }

    
}
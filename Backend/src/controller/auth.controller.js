import userModel from "../models/user.model.js";


export const register = async (req,res)=>{
    const {contact , password ,fullname,email} = req.body;

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
            contact
        });



    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message:"Kuch toh gadbad hai re bhai(server error)",
            success:false
        })
    }

    
}
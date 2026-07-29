import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required : true,
        unique : true
    },
    fullname:{
        type:String,
        required:true
    },
    contact:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    role:{
        type:String,
        enum:["buyer","seller"],
        default:"buyer"
    }
});

//  using pre method for hasing password

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash; 
});


userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
};

const userModel = mongoose.model("user",userSchema);

export default userModel;
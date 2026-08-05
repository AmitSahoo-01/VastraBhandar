import mongoose from "mongoose";
import priceSchema from "./price.schema.js";


const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    price:{
        type:priceSchema,
        required:true
    },
    images:[
        {
            url:{
                type:String,
                required:true
            }
        }
    ],
    stock:{
        type:Number,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    variants: [
        {
            images:[
                {
                    url:{
                        type:String,
                        required:true
                    }
                }
            ],
            price:{
                type:priceSchema,
            },
            stock:{ 
                type:Number,
                default:0,
            },
            attributes:{
                type:Map,
                of:String,
            }
        }
    ]
},{timestamps:true});


const productModel = mongoose.model("product", productSchema);


export default productModel;


//   https://drive.google.com/file/d/1_baeoL-aWqgn350i_tip59nqeD1FUsQv/view
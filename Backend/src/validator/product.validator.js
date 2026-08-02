import { body, validationResult } from "express-validator";

function validateRequest(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            success:false,
            message:"Arree bhai validation fail hoo gaya",
            errors:errors.array()
        });
    }
    next();
};

export const createProductValidator = [
    body("title").notEmpty().withMessage("Arree bhai title nahi hai kya"),
    body("description").notEmpty().withMessage("Arree bhai description nahi hai kya"),
    body("priceAmount").notEmpty().withMessage("Arree bhai price sahi nahi hai kya"),
    body("priceCurrency").notEmpty().withMessage("Arree bhai priceCurrency sahi nahi hai kya"),
    
    validateRequest
]



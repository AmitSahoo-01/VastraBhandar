import {body,validationResult} from 'express-validator';

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


export const validateRegisterUser = [
    body("email").isEmail().withMessage("Arree bhai tera sahi email dalna kyun gandu hoo raha hai!"),
    body("contact").notEmpty().matches(/^\d{10}$/).withMessage("Arree bhai contact tera 10 number ka nahi hai kya"),
    body("password").isLength({min:6,max:20}).withMessage("Arree bhai password min 6 and max 20 characters ka nahi hai kya"),
    body("fullname").isLength({min:3,max:50}).withMessage("Arree bhai full name tera 3 to 50 characters ka nahi hai kya"),
    body("isSeller").isBoolean().withMessage("Arree bhai seller hai ki nahi wo toh bata!"),
    
    validateRequest
]

export const validateLoginUser = [
    body("email").isEmail().withMessage("Arree bhai tera sahi email dalna kyun gandu hoo raha hai!"),
    body("password").isLength({min:6,max:20}).withMessage("Arree bhai password min 6 and max 20 characters ka nahi hai kya"),
    
    validateRequest
]
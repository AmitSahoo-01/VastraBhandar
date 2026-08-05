import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {validateAddToCart} from "../validator/cart.validator.js";
import {addToCart,getCart} from "../controller/cart.controller.js";

const router = express.Router();

//  post--> /add/:productId/:variantId
//  add to cart for any product
//  access private only authenticate user can cart the items
router.post("/add/:productId/:variantId",authenticateUser,validateAddToCart,addToCart);

//  cart controller 
router.get("/",authenticateUser,getCart);

export default router;  
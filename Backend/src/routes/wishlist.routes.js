import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { toggleWishlist, getWishlist } from "../controller/wishlist.controller.js";

const router = express.Router();

router.post("/toggle/:productId", authenticateUser, toggleWishlist);
router.get("/", authenticateUser, getWishlist);

export default router;

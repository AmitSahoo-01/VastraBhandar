import { Router } from "express";
import { validateRegisterUser } from "../validator/auth.validator.js";
import {register} from '../controller/auth.controller.js';

const router = Router();

/*
post - api/auth/register
for register a new user.
*/
router.post('/register', validateRegisterUser , register );

export default router;
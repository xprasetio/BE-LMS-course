import express from "express";
import { validateRequest } from "../middlewares/validateRequest.js";
import { signUpSchema } from "../utils/schema.js";
import { signUpAction } from "../controllers/authController.js";
import { SignInAction } from "../controllers/authController.js";
import { signInSchema } from "../utils/schema.js";

const authRoutes = express.Router();

authRoutes.post('/sign-up', validateRequest(signUpSchema), signUpAction);
authRoutes.post('/sign-in', validateRequest(signInSchema), SignInAction);

export default authRoutes;
import { Router } from "express";
import * as authController from "../controllers/auth.controller.js"
const authRouter = Router();

authRouter.post("/registering",authController.registering)
authRouter.get("/getMe",authController.getMe)
export default authRouter;
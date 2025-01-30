import e from "express";
import { handleSignUp } from "../controller/user.controller.js";
const router = e.Router()
 
router.post("/signUp", handleSignUp )

export default router; 
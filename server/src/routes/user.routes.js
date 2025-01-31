import e from "express";
import { handleLogin, handleSignUp } from "../controller/user.controller.js";
const router = e.Router()
 
router.route("/signup").post( handleSignUp )
router.route("/login").post(handleLogin)

export default router; 
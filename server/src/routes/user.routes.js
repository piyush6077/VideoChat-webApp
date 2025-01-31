import e from "express";
import { getCurrentUser, handleLogin, handleLogout, handleSignUp, updateAccountDetail } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = e.Router()
 
router.route("/signup").post( handleSignUp )
router.route("/login").post(handleLogin)
router.route("/logout").post(verifyJWT, handleLogout)
router.route("/updateUserProfile").post(verifyJWT , updateAccountDetail)

router.route("/getUser").get(verifyJWT, getCurrentUser)
export default router; 
import express from "express"
import { forgotPassword, loginUser, registerUser, resetPassword } from "../controller/controller.auth.js";
import uploadFile from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/register",uploadFile, registerUser)
router.post("/login", loginUser)
router.post("/forgot", forgotPassword)
router.post("/reset/:token", resetPassword)

export default router
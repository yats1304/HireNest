import express from "express"
import { loginUser, registerUser } from "../controller/controller.auth.js";
import uploadFile from "../middleware/multer.middleware.js";

const router = express.Router();

router.post("/register",uploadFile, registerUser)
router.post("/login", loginUser)

export default router
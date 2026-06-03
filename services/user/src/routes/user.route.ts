import express from "express"
import { isAuth } from "../middleware/auth.middleware.js"
import { getUserProfile, myProfile } from "../controller/user.controller.js"

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/:userId", isAuth, getUserProfile)

export default router
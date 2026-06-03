import express from "express"
import { isAuth } from "../middleware/auth.middleware.js"
import { addSkillsToUser, deleteSkillFromUser, getUserProfile, myProfile, updateProfilePicture, updateResume, updateUserProfile } from "../controller/user.controller.js"
import uploadFile from "../middleware/multer.middleware.js"

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/:userId", isAuth, getUserProfile)
router.put("/update/profile", isAuth, updateUserProfile)
router.put("/update/pic", isAuth, uploadFile, updateProfilePicture)
router.put("/update/resume", isAuth, uploadFile, updateResume)
router.post("/skill/add", isAuth, addSkillsToUser)
router.delete("/skill/delete", isAuth, deleteSkillFromUser)

export default router
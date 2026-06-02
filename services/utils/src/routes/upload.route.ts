import express from "express"
import Upload from "../controller/upload.controller.js";

const router = express.Router();

router.post("/upload", Upload)

export default router
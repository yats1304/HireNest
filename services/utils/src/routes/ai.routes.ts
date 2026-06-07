import express from "express"
import { careerAI, resumeAnalyzer } from "../controller/ai.controller.js"

const route = express.Router()

route.post("/career", careerAI)
route.post("/resume-analyzer", resumeAnalyzer)

export default route
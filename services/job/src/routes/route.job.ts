import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import uploadFile from "../middleware/multer.middleware.js";
import { createCompany, createJob, deleteCompany, updateJob } from "../controllers/controller.job.js";

const router = express.Router();

router.post("/company/new", isAuth, uploadFile, createCompany)
router.delete("/company/:companyId", isAuth, deleteCompany)
router.post("/new", isAuth, createJob)
router.put("/:jobId", isAuth, updateJob)

export default router
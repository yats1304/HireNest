import express from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import uploadFile from "../middleware/multer.middleware.js";
import {
  createCompany,
  createJob,
  deleteCompany,
  getAllActiveJobs,
  getAllApplicationsForJob,
  getAllCompanies,
  getCompanyDetails,
  getSingleJob,
  updateApplication,
  updateJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.post("/company/new", isAuth, uploadFile, createCompany);
router.delete("/company/:companyId", isAuth, deleteCompany);
router.post("/new", isAuth, createJob);
router.put("/:jobId", isAuth, updateJob);
router.get("/company/all", isAuth, getAllCompanies);
router.get("/company/:id", getCompanyDetails);
router.get("/all", getAllActiveJobs);
router.get("/:jobId", getSingleJob);
router.get("/applications/:jobId", isAuth, getAllApplicationsForJob);
router.put("/application/update/:id", isAuth, updateApplication);

export default router;

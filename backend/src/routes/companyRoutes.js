import express from "express"
import multer from "multer"
import {
  registerCompany,
  getCompanyProfile,
  updateCompanyProfile,
  uploadLogo,
  uploadBanner,
} from "../controllers/companyController.js"
import { authenticateToken } from "../middleware/auth.js"
import { validateCompanyProfile, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed"))
    }
  },
})

// All routes require authentication
router.use(authenticateToken)

router.post("/register", validateCompanyProfile, handleValidationErrors, registerCompany)
router.get("/profile", getCompanyProfile)
router.put("/profile", validateCompanyProfile, handleValidationErrors, updateCompanyProfile)
router.post("/upload-logo", upload.single("logo"), uploadLogo)
router.post("/upload-banner", upload.single("banner"), uploadBanner)

export default router

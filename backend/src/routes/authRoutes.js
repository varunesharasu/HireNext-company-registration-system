import express from "express"
import { register, login, verifyEmail, verifyMobile } from "../controllers/authController.js"
import { validateRegistration, validateLogin, handleValidationErrors } from "../middleware/validation.js"

const router = express.Router()

router.post("/register", validateRegistration, handleValidationErrors, register)
router.post("/login", validateLogin, handleValidationErrors, login)
router.get("/verify-email/:userId", verifyEmail)
router.post("/verify-mobile", verifyMobile)

export default router

import { body, validationResult } from "express-validator"
import { parsePhoneNumber } from "libphonenumber-js"
import sanitizeHtml from "sanitize-html"
import createError from "http-errors"

export const validateRegistration = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage("Password must be at least 8 characters with uppercase, lowercase, number and special character"),
  body("full_name").trim().isLength({ min: 2, max: 255 }).withMessage("Full name must be between 2 and 255 characters"),
  body("gender").isIn(["m", "f", "o"]).withMessage("Gender must be m, f, or o"),
  body("mobile_no").custom((value) => {
    try {
      const phoneNumber = parsePhoneNumber(value)
      if (!phoneNumber.isValid()) {
        throw new Error("Invalid phone number")
      }
      return true
    } catch (error) {
      throw new Error("Invalid phone number format")
    }
  }),
]

export const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
]

export const validateCompanyProfile = [
  body("company_name")
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage("Company name must be between 2 and 255 characters"),
  body("address").trim().isLength({ min: 5 }).withMessage("Address is required"),
  body("city").trim().isLength({ min: 2, max: 50 }).withMessage("City is required"),
  body("state").trim().isLength({ min: 2, max: 50 }).withMessage("State is required"),
  body("country").trim().isLength({ min: 2, max: 50 }).withMessage("Country is required"),
  body("postal_code").trim().isLength({ min: 3, max: 20 }).withMessage("Postal code is required"),
  body("industry").trim().isLength({ min: 2 }).withMessage("Industry is required"),
  body("website").optional().isURL().withMessage("Valid website URL required"),
]

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(createError(400, "Validation failed", { errors: errors.array() }))
  }

  // Sanitize text inputs
  const sanitizeOptions = {
    allowedTags: [],
    allowedAttributes: {},
  }

  for (const key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = sanitizeHtml(req.body[key], sanitizeOptions)
    }
  }

  next()
}

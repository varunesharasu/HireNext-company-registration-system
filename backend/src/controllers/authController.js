import { User } from "../models/User.js"
import { auth } from "../config/firebase.js"
import { generateToken } from "../utils/jwt.js"
import createError from "http-errors"

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, gender, mobile_no } = req.body

    // Check if user already exists
    const existingUser = await User.findByEmail(email)
    if (existingUser) {
      return next(createError(409, "User already exists with this email"))
    }

    // Create user in database
    const user = await User.create({
      email,
      password,
      full_name,
      gender,
      mobile_no,
      signup_type: "e",
    })

    // Create user in Firebase for authentication
    try {
      await auth.createUser({
        uid: user.id.toString(),
        email: user.email,
        password: password,
        displayName: user.full_name,
        phoneNumber: user.mobile_no,
      })
    } catch (firebaseError) {
      console.error("Firebase user creation error:", firebaseError)
      // Continue even if Firebase fails, as we have the user in our database
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your mobile number and email.",
      data: {
        user_id: user.id,
        email: user.email,
        full_name: user.full_name,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user in database
    const user = await User.findByEmail(email)
    if (!user) {
      return next(createError(401, "Invalid email or password"))
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password)
    if (!isValidPassword) {
      return next(createError(401, "Invalid email or password"))
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    })

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          gender: user.gender,
          mobile_no: user.mobile_no,
          is_mobile_verified: user.is_mobile_verified,
          is_email_verified: user.is_email_verified,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req, res, next) => {
  try {
    const { userId } = req.params

    const user = await User.updateVerificationStatus(userId, "is_email_verified", true)
    if (!user) {
      return next(createError(404, "User not found"))
    }

    res.json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const verifyMobile = async (req, res, next) => {
  try {
    const { userId, otp } = req.body

    // In a real implementation, you would verify the OTP with Firebase
    // For now, we'll just mark as verified
    const user = await User.updateVerificationStatus(userId, "is_mobile_verified", true)
    if (!user) {
      return next(createError(404, "User not found"))
    }

    res.json({
      success: true,
      message: "Mobile number verified successfully",
    })
  } catch (error) {
    next(error)
  }
}

"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import PhoneInput from "react-phone-input-2"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock, Person, ArrowBack, ArrowForward } from "@mui/icons-material"
import { registerUser, verifyMobile } from "../store/slices/authSlice"

const steps = ["Personal Information", "Contact Details", "Verification"]

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [registeredUserId, setRegisteredUserId] = useState(null)
  const [otpCode, setOtpCode] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      gender: "m",
    },
  })

  const watchedFields = watch()

  const validateStep = async (step) => {
    let fieldsToValidate = []

    switch (step) {
      case 0:
        fieldsToValidate = ["full_name", "gender"]
        break
      case 1:
        fieldsToValidate = ["email", "password", "mobile_no"]
        break
      case 2:
        return true // OTP validation handled separately
      default:
        return false
    }

    const result = await trigger(fieldsToValidate)
    return result && (step !== 1 || phoneNumber.length >= 10)
  }

  const handleNext = async () => {
    const isValid = await validateStep(activeStep)
    if (isValid) {
      if (activeStep === 1) {
        // Submit registration
        const formData = {
          ...getValues(),
          mobile_no: `+${phoneNumber}`,
        }

        const result = await dispatch(registerUser(formData))
        if (result.type === "auth/register/fulfilled") {
          setRegisteredUserId(result.payload.data.user_id)
          setActiveStep(activeStep + 1)
        }
      } else {
        setActiveStep(activeStep + 1)
      }
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleVerifyOTP = async () => {
    if (otpCode.length === 6 && registeredUserId) {
      const result = await dispatch(
        verifyMobile({
          userId: registeredUserId,
          otp: otpCode,
        }),
      )
      if (result.type === "auth/verifyMobile/fulfilled") {
        navigate("/login")
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Full Name"
              name="full_name"
              autoComplete="name"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              {...register("full_name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
                maxLength: {
                  value: 255,
                  message: "Full name must be less than 255 characters",
                },
              })}
              error={!!errors.full_name}
              helperText={errors.full_name?.message}
            />

            <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                aria-label="gender"
                name="gender"
                value={watchedFields.gender}
                onChange={(e) => setValue("gender", e.target.value)}
              >
                <FormControlLabel value="m" control={<Radio />} label="Male" />
                <FormControlLabel value="f" control={<Radio />} label="Female" />
                <FormControlLabel value="o" control={<Radio />} label="Other" />
              </RadioGroup>
            </FormControl>
          </Box>
        )

      case 1:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="new-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                  message: "Password must contain uppercase, lowercase, number and special character",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Mobile Number
              </Typography>
              <PhoneInput
                country={"us"}
                value={phoneNumber}
                onChange={setPhoneNumber}
                inputStyle={{
                  width: "100%",
                  height: "56px",
                  fontSize: "16px",
                }}
                containerStyle={{
                  width: "100%",
                }}
              />
              {phoneNumber.length < 10 && (
                <Typography variant="caption" color="error">
                  Please enter a valid phone number
                </Typography>
              )}
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Verify Your Mobile Number
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a verification code to +{phoneNumber}
            </Typography>

            <TextField
              fullWidth
              label="Enter OTP Code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              inputProps={{
                maxLength: 6,
                style: { textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" },
              }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOTP}
              disabled={otpCode.length !== 6 || loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : "Verify & Complete Registration"}
            </Button>
          </Box>
        )

      default:
        return "Unknown step"
    }
  }

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography component="h1" variant="h4" color="primary" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join us to manage your company profile
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}

            {activeStep < 2 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                <Button onClick={handleBack} disabled={activeStep === 0} startIcon={<ArrowBack />}>
                  Back
                </Button>

                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  endIcon={activeStep === 1 ? null : <ArrowForward />}
                  sx={{ px: 4 }}
                >
                  {loading ? <CircularProgress size={24} /> : activeStep === 1 ? "Create Account" : "Next"}
                </Button>
              </Box>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Register

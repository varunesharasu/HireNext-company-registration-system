"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Business, LocationOn, Language, ArrowBack, ArrowForward, Save } from "@mui/icons-material"
import { registerCompany } from "../store/slices/companySlice"
import Layout from "../components/Layout"

const steps = ["Company Details", "Address Information", "Additional Information"]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Consulting",
  "Media & Entertainment",
  "Transportation",
  "Food & Beverage",
  "Other",
]

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "India",
  "Japan",
  "Other",
]

const CompanyRegistration = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.company)

  const [activeStep, setActiveStep] = useState(0)
  const [foundedDate, setFoundedDate] = useState(null)
  const [socialLinks, setSocialLinks] = useState({
    website: "",
    linkedin: "",
    twitter: "",
    facebook: "",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm()

  const watchedFields = watch()

  const validateStep = async (step) => {
    let fieldsToValidate = []

    switch (step) {
      case 0:
        fieldsToValidate = ["company_name", "industry"]
        break
      case 1:
        fieldsToValidate = ["address", "city", "state", "country", "postal_code"]
        break
      case 2:
        return true // Optional fields
      default:
        return false
    }

    return await trigger(fieldsToValidate)
  }

  const handleNext = async () => {
    const isValid = await validateStep(activeStep)
    if (isValid) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const onSubmit = async (data) => {
    const companyData = {
      ...data,
      founded_date: foundedDate ? foundedDate.toISOString().split("T")[0] : null,
      social_links: Object.keys(socialLinks).reduce((acc, key) => {
        if (socialLinks[key]) {
          acc[key] = socialLinks[key]
        }
        return acc
      }, {}),
    }

    const result = await dispatch(registerCompany(companyData))
    if (result.type === "company/register/fulfilled") {
      navigate("/dashboard")
    }
  }

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }))
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="company_name"
                label="Company Name"
                name="company_name"
                autoFocus
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: "action.active" }} />,
                }}
                {...register("company_name", {
                  required: "Company name is required",
                  minLength: {
                    value: 2,
                    message: "Company name must be at least 2 characters",
                  },
                })}
                error={!!errors.company_name}
                helperText={errors.company_name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Industry</InputLabel>
                <Select
                  value={watchedFields.industry || ""}
                  label="Industry"
                  {...register("industry", {
                    required: "Industry is required",
                  })}
                  error={!!errors.industry}
                >
                  {industries.map((industry) => (
                    <MenuItem key={industry} value={industry}>
                      {industry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.industry && (
                <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                  {errors.industry.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                label="Company Description"
                name="description"
                multiline
                rows={4}
                placeholder="Tell us about your company..."
                {...register("description")}
              />
            </Grid>
          </Grid>
        )

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="address"
                label="Street Address"
                name="address"
                InputProps={{
                  startAdornment: <LocationOn sx={{ mr: 1, color: "action.active" }} />,
                }}
                {...register("address", {
                  required: "Address is required",
                  minLength: {
                    value: 5,
                    message: "Address must be at least 5 characters",
                  },
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                {...register("city", {
                  required: "City is required",
                })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="state"
                label="State/Province"
                name="state"
                {...register("state", {
                  required: "State is required",
                })}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Country</InputLabel>
                <Select
                  value={watchedFields.country || ""}
                  label="Country"
                  {...register("country", {
                    required: "Country is required",
                  })}
                  error={!!errors.country}
                >
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.country && (
                <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                  {errors.country.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="postal_code"
                label="Postal Code"
                name="postal_code"
                {...register("postal_code", {
                  required: "Postal code is required",
                })}
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
              />
            </Grid>
          </Grid>
        )

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="website"
                label="Company Website"
                name="website"
                placeholder="https://www.example.com"
                InputProps={{
                  startAdornment: <Language sx={{ mr: 1, color: "action.active" }} />,
                }}
                {...register("website", {
                  pattern: {
                    value: /^https?:\/\/.+\..+/,
                    message: "Please enter a valid URL",
                  },
                })}
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Founded Date
              </Typography>
              <DatePicker
                selected={foundedDate}
                onChange={setFoundedDate}
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                showYearDropdown
                yearDropdownItemNumber={50}
                customInput={<TextField fullWidth placeholder="Select founding date" />}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Social Media Links (Optional)
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="LinkedIn"
                    placeholder="https://linkedin.com/company/..."
                    value={socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Twitter"
                    placeholder="https://twitter.com/..."
                    value={socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    placeholder="https://facebook.com/..."
                    value={socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange("facebook", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )

      default:
        return "Unknown step"
    }
  }

  return (
    <Layout>
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography component="h1" variant="h4" color="primary" gutterBottom>
                Company Registration
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Complete your company profile to get started
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
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {renderStepContent(activeStep)}

              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button onClick={handleBack} disabled={activeStep === 0} startIcon={<ArrowBack />}>
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button type="submit" variant="contained" disabled={loading} startIcon={<Save />} sx={{ px: 4 }}>
                    {loading ? <CircularProgress size={24} /> : "Register Company"}
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext} endIcon={<ArrowForward />} sx={{ px: 4 }}>
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Layout>
  )
}

export default CompanyRegistration

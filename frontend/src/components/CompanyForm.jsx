"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import DatePicker from "react-datepicker"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import { Save, Cancel } from "@mui/icons-material"

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

const CompanyForm = ({ open, onClose, onSubmit, company, loading }) => {
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
    reset,
    setValue,
    watch,
  } = useForm()

  const watchedFields = watch()

  useEffect(() => {
    if (company) {
      // Populate form with existing company data
      Object.keys(company).forEach((key) => {
        if (key !== "social_links" && key !== "founded_date") {
          setValue(key, company[key])
        }
      })

      if (company.founded_date) {
        setFoundedDate(new Date(company.founded_date))
      }

      if (company.social_links) {
        setSocialLinks({
          website: company.social_links.website || "",
          linkedin: company.social_links.linkedin || "",
          twitter: company.social_links.twitter || "",
          facebook: company.social_links.facebook || "",
        })
      }
    }
  }, [company, setValue])

  const handleClose = () => {
    reset()
    setFoundedDate(null)
    setSocialLinks({
      website: "",
      linkedin: "",
      twitter: "",
      facebook: "",
    })
    onClose()
  }

  const handleFormSubmit = (data) => {
    const formData = {
      ...data,
      founded_date: foundedDate ? foundedDate.toISOString().split("T")[0] : null,
      social_links: Object.keys(socialLinks).reduce((acc, key) => {
        if (socialLinks[key]) {
          acc[key] = socialLinks[key]
        }
        return acc
      }, {}),
    }
    onSubmit(formData)
  }

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }))
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{company ? "Edit Company Profile" : "Add Company Profile"}</DialogTitle>

      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Company Name"
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

            <Grid item xs={12} sm={6}>
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
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Description" multiline rows={3} {...register("description")} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                {...register("address", {
                  required: "Address is required",
                })}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="City"
                {...register("city", {
                  required: "City is required",
                })}
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="State/Province"
                {...register("state", {
                  required: "State is required",
                })}
                error={!!errors.state}
                helperText={errors.state?.message}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Postal Code"
                {...register("postal_code", {
                  required: "Postal code is required",
                })}
                error={!!errors.postal_code}
                helperText={errors.postal_code?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                placeholder="https://www.example.com"
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
              <Typography variant="subtitle1" gutterBottom>
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
              <Typography variant="subtitle1" gutterBottom>
                Social Media Links
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
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} startIcon={<Cancel />}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CompanyForm

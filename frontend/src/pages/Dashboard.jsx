"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Fab,
  Chip,
} from "@mui/material"
import { Add, Business, Edit, CloudUpload, Verified, Warning } from "@mui/icons-material"
import { fetchCompanyProfile } from "../store/slices/companySlice"
import Layout from "../components/Layout"
import ProfileCard from "../components/ProfileCard"
import CompanyForm from "../components/CompanyForm"
import ImageUploadDialog from "../components/ImageUploadDialog"

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const { profile, hasProfile, loading, error } = useSelector((state) => state.company)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [imageUploadOpen, setImageUploadOpen] = useState(false)
  const [uploadType, setUploadType] = useState("logo")

  useEffect(() => {
    dispatch(fetchCompanyProfile())
  }, [dispatch])

  const handleCreateCompany = () => {
    navigate("/company-registration")
  }

  const handleEditProfile = () => {
    setEditDialogOpen(true)
  }

  const handleImageUpload = (type) => {
    setUploadType(type)
    setImageUploadOpen(true)
  }

  const getVerificationStatus = () => {
    if (!user) return null

    const verifications = []

    if (user.is_email_verified) {
      verifications.push({ label: "Email Verified", color: "success", icon: <Verified /> })
    } else {
      verifications.push({ label: "Email Pending", color: "warning", icon: <Warning /> })
    }

    if (user.is_mobile_verified) {
      verifications.push({ label: "Mobile Verified", color: "success", icon: <Verified /> })
    } else {
      verifications.push({ label: "Mobile Pending", color: "warning", icon: <Warning /> })
    }

    return verifications
  }

  if (loading) {
    return (
      <Layout>
        <Box className="loading-spinner">
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxWidth="lg" className="dashboard-container">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.full_name}! Manage your company profile and settings.
          </Typography>
        </Box>

        {/* User Verification Status */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Account Status
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {getVerificationStatus()?.map((status, index) => (
                <Chip key={index} icon={status.icon} label={status.label} color={status.color} variant="outlined" />
              ))}
            </Box>
          </CardContent>
        </Card>

        {error && error !== "no_profile" && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!hasProfile ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <Business sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No Company Profile Found
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Create your company profile to get started with managing your business information.
              </Typography>
              <Button variant="contained" size="large" startIcon={<Add />} onClick={handleCreateCompany} sx={{ mt: 2 }}>
                Create Company Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Box>
            <ProfileCard company={profile} onEdit={handleEditProfile} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Company Logo
                    </Typography>
                    <Box sx={{ textAlign: "center" }}>
                      {profile?.logo_url ? (
                        <img
                          src={profile.logo_url || "/placeholder.svg?height=150&width=150&query=company logo"}
                          alt="Company Logo"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 150,
                            height: 150,
                            bgcolor: "grey.100",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <Business sx={{ fontSize: 48, color: "text.secondary" }} />
                        </Box>
                      )}
                      <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => handleImageUpload("logo")}>
                        {profile?.logo_url ? "Change Logo" : "Upload Logo"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Company Banner
                    </Typography>
                    <Box sx={{ textAlign: "center" }}>
                      {profile?.banner_url ? (
                        <img
                          src={profile.banner_url || "/placeholder.svg?height=100&width=300&query=company banner"}
                          alt="Company Banner"
                          style={{
                            width: "100%",
                            maxWidth: "300px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: "100%",
                            maxWidth: 300,
                            height: 100,
                            bgcolor: "grey.100",
                            borderRadius: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          <CloudUpload sx={{ fontSize: 32, color: "text.secondary" }} />
                        </Box>
                      )}
                      <Button
                        variant="outlined"
                        startIcon={<CloudUpload />}
                        onClick={() => handleImageUpload("banner")}
                      >
                        {profile?.banner_url ? "Change Banner" : "Upload Banner"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Floating Action Button for Quick Actions */}
        {hasProfile && (
          <Fab
            color="primary"
            aria-label="edit"
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            onClick={handleEditProfile}
          >
            <Edit />
          </Fab>
        )}

        {/* Edit Company Dialog */}
        <CompanyForm
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={(data) => {
            // Handle form submission
            console.log("Form data:", data)
            setEditDialogOpen(false)
          }}
          company={profile}
          loading={loading}
        />

        {/* Image Upload Dialog */}
        <ImageUploadDialog
          open={imageUploadOpen}
          onClose={() => setImageUploadOpen(false)}
          type={uploadType}
          currentImage={uploadType === "logo" ? profile?.logo_url : profile?.banner_url}
        />
      </Container>
    </Layout>
  )
}

export default Dashboard

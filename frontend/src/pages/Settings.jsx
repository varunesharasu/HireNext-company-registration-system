"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import { Save, Edit, Delete, Security, Notifications, AccountCircle, Business, Warning } from "@mui/icons-material"
import { updateCompanyProfile } from "../store/slices/companySlice"
import { logout } from "../store/slices/authSlice"
import Layout from "../components/Layout"
import CompanyForm from "../components/CompanyForm"

const Settings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { profile, loading } = useSelector((state) => state.company)

  const [activeTab, setActiveTab] = useState("profile")
  const [editCompanyOpen, setEditCompanyOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    marketing: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
    },
  })

  const handleUpdateProfile = (data) => {
    console.log("Update user profile:", data)
    // Implement user profile update
  }

  const handleUpdateCompany = async (data) => {
    const result = await dispatch(updateCompanyProfile(data))
    if (result.type === "company/updateProfile/fulfilled") {
      setEditCompanyOpen(false)
    }
  }

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDeleteAccount = () => {
    // Implement account deletion
    console.log("Delete account confirmed")
    setDeleteDialogOpen(false)
    dispatch(logout())
  }

  const renderProfileSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>

        <Box component="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                {...register("full_name", {
                  required: "Full name is required",
                })}
                error={!!errors.full_name}
                helperText={errors.full_name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                disabled
                {...register("email")}
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                disabled
                value={user?.mobile_no || ""}
                helperText="Mobile number cannot be changed"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Gender"
                disabled
                value={user?.gender === "m" ? "Male" : user?.gender === "f" ? "Female" : "Other"}
                helperText="Gender cannot be changed"
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )

  const renderCompanySettings = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">Company Information</Typography>
          <Button variant="outlined" startIcon={<Edit />} onClick={() => setEditCompanyOpen(true)} disabled={!profile}>
            Edit Company
          </Button>
        </Box>

        {profile ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Company Name
              </Typography>
              <Typography variant="body1">{profile.company_name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Industry
              </Typography>
              <Typography variant="body1">{profile.industry}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {profile.address}, {profile.city}, {profile.state}, {profile.country} {profile.postal_code}
              </Typography>
            </Grid>
            {profile.website && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Website
                </Typography>
                <Typography variant="body1" color="primary" component="a" href={profile.website} target="_blank">
                  {profile.website}
                </Typography>
              </Grid>
            )}
          </Grid>
        ) : (
          <Alert severity="info">No company profile found. Please create one from the dashboard.</Alert>
        )}
      </CardContent>
    </Card>
  )

  const renderNotificationSettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notification Preferences
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary="Email Notifications" secondary="Receive updates and alerts via email" />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.email}
                onChange={() => handleNotificationChange("email")}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="SMS Notifications" secondary="Receive important alerts via SMS" />
            <ListItemSecondaryAction>
              <Switch checked={notifications.sms} onChange={() => handleNotificationChange("sms")} color="primary" />
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Marketing Communications" secondary="Receive promotional emails and updates" />
            <ListItemSecondaryAction>
              <Switch
                checked={notifications.marketing}
                onChange={() => handleNotificationChange("marketing")}
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  )

  const renderSecuritySettings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Security Settings
        </Typography>

        <List>
          <ListItem>
            <ListItemText primary="Change Password" secondary="Update your account password" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Change
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Two-Factor Authentication"
              secondary="Add an extra layer of security to your account"
            />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Enable
              </Button>
            </ListItemSecondaryAction>
          </ListItem>

          <ListItem>
            <ListItemText primary="Login Sessions" secondary="Manage your active login sessions" />
            <ListItemSecondaryAction>
              <Button variant="outlined" size="small">
                Manage
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Once you delete your account, there is no going back. Please be certain.
          </Typography>
          <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Box>
      </CardContent>
    </Card>
  )

  const tabs = [
    { id: "profile", label: "Profile", icon: <AccountCircle /> },
    { id: "company", label: "Company", icon: <Business /> },
    { id: "notifications", label: "Notifications", icon: <Notifications /> },
    { id: "security", label: "Security", icon: <Security /> },
  ]

  return (
    <Layout>
      <Container maxWidth="lg" className="settings-container">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account and company settings
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent sx={{ p: 1 }}>
                <List component="nav">
                  {tabs.map((tab) => (
                    <ListItem
                      key={tab.id}
                      button
                      selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        "&.Mui-selected": {
                          bgcolor: "primary.50",
                          color: "primary.main",
                          "& .MuiListItemIcon-root": {
                            color: "primary.main",
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                        {tab.icon}
                        <Typography variant="body2" sx={{ ml: 2 }}>
                          {tab.label}
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={9}>
            {activeTab === "profile" && renderProfileSettings()}
            {activeTab === "company" && renderCompanySettings()}
            {activeTab === "notifications" && renderNotificationSettings()}
            {activeTab === "security" && renderSecuritySettings()}
          </Grid>
        </Grid>

        {/* Edit Company Dialog */}
        <CompanyForm
          open={editCompanyOpen}
          onClose={() => setEditCompanyOpen(false)}
          onSubmit={handleUpdateCompany}
          company={profile}
          loading={loading}
        />

        {/* Delete Account Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
            <Warning color="error" sx={{ mr: 1 }} />
            Delete Account
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all
              your data.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDeleteAccount} color="error" variant="contained">
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  )
}

export default Settings

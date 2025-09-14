"use client"
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton, Avatar } from "@mui/material"
import { Edit, Language, LocationOn, Business, LinkedIn, Twitter, Facebook } from "@mui/icons-material"

const ProfileCard = ({ company, onEdit }) => {
  if (!company) return null

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "linkedin":
        return <LinkedIn />
      case "twitter":
        return <Twitter />
      case "facebook":
        return <Facebook />
      default:
        return <Language />
    }
  }

  return (
    <Card sx={{ mb: 3 }}>
      {company.banner_url && (
        <CardMedia
          component="img"
          height="200"
          image={company.banner_url || "/generic-company-banner.png"}
          alt="Company Banner"
          className="company-banner"
        />
      )}

      <CardContent>
        <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
          {company.logo_url && (
            <Avatar
              src={company.logo_url || "/placeholder.svg?height=80&width=80&query=company logo"}
              alt="Company Logo"
              sx={{
                width: 80,
                height: 80,
                mr: 2,
                ...(company.banner_url && { mt: -5 }),
              }}
            />
          )}

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {company.company_name}
                </Typography>
                <Chip icon={<Business />} label={company.industry} color="primary" variant="outlined" sx={{ mb: 1 }} />
              </Box>

              <IconButton onClick={onEdit} color="primary">
                <Edit />
              </IconButton>
            </Box>

            {company.description && (
              <Typography variant="body1" color="text.secondary" paragraph>
                {company.description}
              </Typography>
            )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="body2" color="text.secondary">
                  {company.city}, {company.state}, {company.country}
                </Typography>
              </Box>

              {company.website && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Language sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography
                    variant="body2"
                    color="primary"
                    component="a"
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textDecoration: "none" }}
                  >
                    Website
                  </Typography>
                </Box>
              )}
            </Box>

            {company.social_links && Object.keys(company.social_links).length > 0 && (
              <Box sx={{ display: "flex", gap: 1 }}>
                {Object.entries(company.social_links).map(([platform, url]) => (
                  <IconButton
                    key={platform}
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="primary"
                  >
                    {getSocialIcon(platform)}
                  </IconButton>
                ))}
              </Box>
            )}

            {company.founded_date && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Founded: {new Date(company.founded_date).getFullYear()}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ProfileCard

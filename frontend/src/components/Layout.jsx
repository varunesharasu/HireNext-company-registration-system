"use client"

import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { AppBar, Toolbar, Typography, Box, Menu, MenuItem, IconButton, useMediaQuery, useTheme } from "@mui/material"
import { AccountCircle, Settings, ExitToApp } from "@mui/icons-material"
import { logout } from "../store/slices/authSlice"

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const { user } = useSelector((state) => state.auth)
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
    handleClose()
  }

  const handleSettings = () => {
    navigate("/settings")
    handleClose()
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: "pointer" }} onClick={handleDashboard}>
            Company Registration
          </Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!isMobile && (
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Welcome, {user.full_name}
                </Typography>
              )}

              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSettings}>
                  <Settings sx={{ mr: 1 }} />
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <main>{children}</main>
    </Box>
  )
}

export default Layout

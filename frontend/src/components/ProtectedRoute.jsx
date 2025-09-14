import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { CircularProgress, Box } from "@mui/material"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)

  if (loading) {
    return (
      <Box className="loading-spinner">
        <CircularProgress />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material"
import { CloudUpload, Cancel } from "@mui/icons-material"
import { uploadLogo, uploadBanner } from "../store/slices/companySlice"
import ImageUploader from "./ImageUploader"

const ImageUploadDialog = ({ open, onClose, type, currentImage }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.company)
  const [selectedFile, setSelectedFile] = useState(null)
  const [error, setError] = useState("")

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setError("")
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    try {
      const uploadAction = type === "logo" ? uploadLogo : uploadBanner
      const result = await dispatch(uploadAction(selectedFile))

      if (result.type.endsWith("/fulfilled")) {
        onClose()
        setSelectedFile(null)
      }
    } catch (err) {
      setError("Upload failed. Please try again.")
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setError("")
    onClose()
  }

  const getTitle = () => {
    return type === "logo" ? "Upload Company Logo" : "Upload Company Banner"
  }

  const getDescription = () => {
    return type === "logo"
      ? "Upload a square image (recommended: 300x300px) for your company logo"
      : "Upload a banner image (recommended: 1200x400px) for your company profile"
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{getTitle()}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getDescription()}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <ImageUploader
          onUpload={handleFileSelect}
          currentImage={currentImage}
          label={`Drop your ${type} here`}
          loading={loading}
          maxSize={type === "logo" ? 2 * 1024 * 1024 : 5 * 1024 * 1024} // 2MB for logo, 5MB for banner
        />

        {selectedFile && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2">
              <strong>Selected file:</strong> {selectedFile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} startIcon={<Cancel />}>
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CloudUpload />}
        >
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ImageUploadDialog

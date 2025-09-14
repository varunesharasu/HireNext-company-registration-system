"use client"

import { useState, useRef } from "react"
import { Box, Typography, CircularProgress, Alert } from "@mui/material"
import { CloudUpload } from "@mui/icons-material"

const ImageUploader = ({
  onUpload,
  currentImage,
  label = "Upload Image",
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  loading = false,
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return false
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return false
    }

    setError("")
    return true
  }

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      onUpload(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <Box>
      <input ref={fileInputRef} type="file" accept={accept} onChange={handleFileChange} style={{ display: "none" }} />

      <Box
        className={`image-upload-container ${dragOver ? "dragover" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        sx={{
          border: "2px dashed",
          borderColor: dragOver ? "primary.main" : "grey.300",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: dragOver ? "primary.50" : "background.paper",
          transition: "all 0.3s ease",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "primary.50",
          },
        }}
      >
        {currentImage ? (
          <Box>
            <img
              src={currentImage || "/placeholder.svg"}
              alt="Current"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Click or drag to replace image
            </Typography>
          </Box>
        ) : (
          <Box>
            {loading ? (
              <CircularProgress sx={{ mb: 2 }} />
            ) : (
              <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            )}
            <Typography variant="h6" gutterBottom>
              {label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag and drop an image here, or click to select
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Max size: {Math.round(maxSize / 1024 / 1024)}MB
            </Typography>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}

export default ImageUploader

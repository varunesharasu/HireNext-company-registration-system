import { Box, Typography, Paper } from "@mui/material"

const FormStep = ({ title, description, children, step, totalSteps }) => {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Step {step} of {totalSteps}: {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </Box>
      {children}
    </Paper>
  )
}

export default FormStep

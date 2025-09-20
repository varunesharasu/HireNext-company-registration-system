import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import companyRoutes from "./routes/companyRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
)
app.use(compression())

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

app.use("/api/auth", authRoutes)
app.use("/api/company", companyRoutes)

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

app.use(errorHandler)

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app

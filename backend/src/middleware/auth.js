import jwt from "jsonwebtoken"
import createError from "http-errors"

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return next(createError(401, "Access token required"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(createError(403, "Invalid or expired token"))
    }
    req.user = user
    next()
  })
}

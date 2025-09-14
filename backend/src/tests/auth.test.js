import request from "supertest"
import app from "../server.js"

describe("Authentication Endpoints", () => {
  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test@example.com",
        password: "Password123!",
        full_name: "Test User",
        gender: "m",
        mobile_no: "+1234567890",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain("registered successfully")
      expect(response.body.data).toHaveProperty("user_id")
    })

    it("should return validation error for invalid email", async () => {
      const userData = {
        email: "invalid-email",
        password: "Password123!",
        full_name: "Test User",
        gender: "m",
        mobile_no: "+1234567890",
      }

      const response = await request(app).post("/api/auth/register").send(userData).expect(400)

      expect(response.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/login", () => {
    it("should login user with valid credentials", async () => {
      // First register a user
      const userData = {
        email: "login@example.com",
        password: "Password123!",
        full_name: "Login User",
        gender: "f",
        mobile_no: "+1234567891",
      }

      await request(app).post("/api/auth/register").send(userData)

      // Then login
      const loginData = {
        email: "login@example.com",
        password: "Password123!",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("token")
      expect(response.body.data).toHaveProperty("user")
    })

    it("should return error for invalid credentials", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "WrongPassword123!",
      }

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401)

      expect(response.body.success).toBe(false)
    })
  })
})

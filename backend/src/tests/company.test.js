import request from "supertest"
import app from "../server.js"

describe("Company Endpoints", () => {
  let authToken
  let userId

  beforeAll(async () => {
    const userData = {
      email: "company@example.com",
      password: "Password123!",
      full_name: "Company User",
      gender: "m",
      mobile_no: "+1234567892",
    }

    await request(app).post("/api/auth/register").send(userData)

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: userData.email,
      password: userData.password,
    })

    authToken = loginResponse.body.data.token
    userId = loginResponse.body.data.user.id
  })

  describe("POST /api/company/register", () => {
    it("should register a company successfully", async () => {
      const companyData = {
        company_name: "Test Company",
        address: "123 Test Street",
        city: "Test City",
        state: "Test State",
        country: "United States",
        postal_code: "12345",
        industry: "Technology",
        website: "https://testcompany.com",
        description: "A test company",
      }

      const response = await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(companyData)
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.data.company_name).toBe(companyData.company_name)
      expect(response.body.data.owner_id).toBe(userId)
    })

    it("should return error when registering duplicate company", async () => {
      const companyData = {
        company_name: "Duplicate Company",
        address: "456 Duplicate Street",
        city: "Duplicate City",
        state: "Duplicate State",
        country: "United States",
        postal_code: "67890",
        industry: "Finance",
      }

      const response = await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(companyData)
        .expect(409)

      expect(response.body.success).toBe(false)
    })
  })

  describe("GET /api/company/profile", () => {
    it("should get company profile successfully", async () => {
      const response = await request(app)
        .get("/api/company/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty("company_name")
      expect(response.body.data).toHaveProperty("owner_id")
    })
  })

  describe("PUT /api/company/profile", () => {
    it("should update company profile successfully", async () => {
      const updateData = {
        company_name: "Updated Test Company",
        description: "Updated description",
      }

      const response = await request(app)
        .put("/api/company/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data.company_name).toBe(updateData.company_name)
    })
  })
})

import pool from "../config/database.js"
import bcrypt from "bcrypt"

export class User {
  static async create(userData) {
    const { email, password, full_name, gender, mobile_no, signup_type = "e" } = userData

    const hashedPassword = await bcrypt.hash(password, 12)

    const query = `
      INSERT INTO users (email, password, full_name, gender, mobile_no, signup_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, full_name, gender, mobile_no, signup_type, is_mobile_verified, is_email_verified, created_at
    `

    const values = [email, hashedPassword, full_name, gender, mobile_no, signup_type]
    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1"
    const result = await pool.query(query, [email])
    return result.rows[0]
  }

  static async findById(id) {
    const query = `
      SELECT id, email, full_name, gender, mobile_no, signup_type, 
             is_mobile_verified, is_email_verified, created_at, updated_at
      FROM users WHERE id = $1
    `
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  static async updateVerificationStatus(id, field, status = true) {
    const query = `UPDATE users SET ${field} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`
    const result = await pool.query(query, [status, id])
    return result.rows[0]
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}

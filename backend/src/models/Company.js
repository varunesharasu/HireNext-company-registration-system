import pool from "../config/database.js"

export class Company {
  static async create(companyData) {
    const {
      owner_id,
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      industry,
      founded_date,
      description,
      social_links,
    } = companyData

    const query = `
      INSERT INTO company_profile 
      (owner_id, company_name, address, city, state, country, postal_code, 
       website, industry, founded_date, description, social_links)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `

    const values = [
      owner_id,
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      industry,
      founded_date,
      description,
      social_links,
    ]

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async findByOwnerId(owner_id) {
    const query = "SELECT * FROM company_profile WHERE owner_id = $1"
    const result = await pool.query(query, [owner_id])
    return result.rows[0]
  }

  static async update(id, companyData) {
    const fields = []
    const values = []
    let paramCount = 1

    for (const [key, value] of Object.entries(companyData)) {
      if (value !== undefined && key !== "id" && key !== "owner_id") {
        fields.push(`${key} = $${paramCount}`)
        values.push(value)
        paramCount++
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update")
    }

    values.push(id)
    const query = `
      UPDATE company_profile 
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async updateImageUrl(id, field, url) {
    const query = `
      UPDATE company_profile 
      SET ${field} = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `
    const result = await pool.query(query, [url, id])
    return result.rows[0]
  }
}

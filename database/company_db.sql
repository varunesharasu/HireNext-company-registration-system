-- Company Registration & Verification Module Database Schema
-- PostgreSQL 15 Database Setup

-- Create database (run this separately if needed)
-- CREATE DATABASE company_registration;

-- Users table for authentication and personal details
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    signup_type VARCHAR(1) NOT NULL DEFAULT 'e',
    gender CHAR(1) NOT NULL CHECK (gender IN ('m', 'f', 'o')),
    mobile_no VARCHAR(20) NOT NULL UNIQUE,
    is_mobile_verified BOOLEAN DEFAULT FALSE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Company profile table linked to users
CREATE TABLE IF NOT EXISTS company_profile (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT NOT NULL,
    founded_date DATE,
    description TEXT,
    social_links JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_profile_updated_at 
    BEFORE UPDATE ON company_profile 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_mobile ON users(mobile_no);
CREATE INDEX IF NOT EXISTS idx_company_owner ON company_profile(owner_id);

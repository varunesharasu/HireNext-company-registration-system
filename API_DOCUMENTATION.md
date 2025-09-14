# Company Registration API Documentation

## Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
\`\`\`
Authorization: Bearer <your_jwt_token>
\`\`\`

## Response Format
All API responses follow this structure:
\`\`\`json
{
  "success": boolean,
  "message": string,
  "data": object | array | null,
  "errors": array (only on validation errors)
}
\`\`\`

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "Password123!",
  "full_name": "John Doe",
  "gender": "m",
  "mobile_no": "+1234567890"
}
\`\`\`

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Min 8 chars, must contain uppercase, lowercase, number, special char
- `full_name`: 2-255 characters
- `gender`: Must be 'm', 'f', or 'o'
- `mobile_no`: Valid international phone number format

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully. Please verify mobile OTP.",
  "data": {
    "user_id": 1
  }
}
\`\`\`

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "Password123!"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "gender": "m",
      "mobile_no": "+1234567890",
      "is_mobile_verified": false,
      "is_email_verified": false
    }
  }
}
\`\`\`

### POST /auth/verify-mobile
Verify mobile number with OTP code.

**Request Body:**
\`\`\`json
{
  "userId": 1,
  "otp": "123456"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Mobile number verified successfully"
}
\`\`\`

### GET /auth/verify-email/:userId
Verify email address (typically called from email link).

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Email verified successfully"
}
\`\`\`

---

## Company Management Endpoints

### POST /company/register
Create a new company profile (requires authentication).

**Request Body:**
\`\`\`json
{
  "company_name": "Tech Innovations Inc",
  "address": "123 Innovation Drive",
  "city": "San Francisco",
  "state": "California",
  "country": "United States",
  "postal_code": "94105",
  "website": "https://techinnovations.com",
  "industry": "Technology",
  "founded_date": "2020-01-15",
  "description": "A leading technology company.",
  "social_links": {
    "linkedin": "https://linkedin.com/company/tech-innovations",
    "twitter": "https://twitter.com/techinnovations"
  }
}
\`\`\`

**Validation Rules:**
- `company_name`: Required, 2-255 characters
- `address`: Required, min 5 characters
- `city`, `state`, `country`: Required, 2-50 characters
- `postal_code`: Required, 3-20 characters
- `industry`: Required
- `website`: Optional, valid URL format
- `founded_date`: Optional, valid date format
- `social_links`: Optional, JSON object

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Company profile created successfully",
  "data": {
    "id": 1,
    "owner_id": 1,
    "company_name": "Tech Innovations Inc",
    "address": "123 Innovation Drive",
    "city": "San Francisco",
    "state": "California",
    "country": "United States",
    "postal_code": "94105",
    "website": "https://techinnovations.com",
    "logo_url": null,
    "banner_url": null,
    "industry": "Technology",
    "founded_date": "2020-01-15",
    "description": "A leading technology company.",
    "social_links": {
      "linkedin": "https://linkedin.com/company/tech-innovations",
      "twitter": "https://twitter.com/techinnovations"
    },
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
\`\`\`

### GET /company/profile
Get the authenticated user's company profile.

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "owner_id": 1,
    "company_name": "Tech Innovations Inc",
    "address": "123 Innovation Drive",
    "city": "San Francisco",
    "state": "California",
    "country": "United States",
    "postal_code": "94105",
    "website": "https://techinnovations.com",
    "logo_url": "https://res.cloudinary.com/demo/image/upload/logo_1.jpg",
    "banner_url": "https://res.cloudinary.com/demo/image/upload/banner_1.jpg",
    "industry": "Technology",
    "founded_date": "2020-01-15",
    "description": "A leading technology company.",
    "social_links": {
      "linkedin": "https://linkedin.com/company/tech-innovations",
      "twitter": "https://twitter.com/techinnovations"
    },
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
\`\`\`

**Response (404) - No Profile:**
\`\`\`json
{
  "success": false,
  "message": "Company profile not found"
}
\`\`\`

### PUT /company/profile
Update the authenticated user's company profile.

**Request Body:** (same as POST /company/register, all fields optional)
\`\`\`json
{
  "company_name": "Updated Company Name",
  "description": "Updated company description"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Company profile updated successfully",
  "data": {
    // Updated company profile object
  }
}
\`\`\`

### POST /company/upload-logo
Upload company logo image.

**Request:** Multipart form data
- `logo`: Image file (max 2MB, image types only)

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Logo uploaded successfully",
  "data": {
    "logo_url": "https://res.cloudinary.com/demo/image/upload/v1234567890/company-logos/logo_1.jpg",
    "company": {
      // Updated company profile with new logo_url
    }
  }
}
\`\`\`

### POST /company/upload-banner
Upload company banner image.

**Request:** Multipart form data
- `banner`: Image file (max 5MB, image types only)

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Banner uploaded successfully",
  "data": {
    "banner_url": "https://res.cloudinary.com/demo/image/upload/v1234567890/company-banners/banner_1.jpg",
    "company": {
      // Updated company profile with new banner_url
    }
  }
}
\`\`\`

---

## Utility Endpoints

### GET /health
Check API server health status.

**Response (200):**
\`\`\`json
{
  "status": "OK",
  "message": "Server is running"
}
\`\`\`

---

## Error Responses

### Validation Error (400)
\`\`\`json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
\`\`\`

### Authentication Error (401)
\`\`\`json
{
  "success": false,
  "message": "Access token required"
}
\`\`\`

### Authorization Error (403)
\`\`\`json
{
  "success": false,
  "message": "Invalid or expired token"
}
\`\`\`

### Resource Not Found (404)
\`\`\`json
{
  "success": false,
  "message": "Company profile not found"
}
\`\`\`

### Conflict Error (409)
\`\`\`json
{
  "success": false,
  "message": "User already exists with this email"
}
\`\`\`

### Server Error (500)
\`\`\`json
{
  "success": false,
  "message": "Internal Server Error"
}
\`\`\`

---

## Rate Limiting
- Authentication endpoints: 5 requests per minute per IP
- File upload endpoints: 10 requests per hour per user
- Other endpoints: 100 requests per minute per user

## File Upload Specifications

### Logo Upload
- **Max size:** 2MB
- **Formats:** JPG, PNG, GIF, WebP
- **Recommended dimensions:** 300x300px (square)
- **Transformations:** Resized to max 300x300px, optimized quality

### Banner Upload
- **Max size:** 5MB
- **Formats:** JPG, PNG, GIF, WebP
- **Recommended dimensions:** 1200x400px (3:1 ratio)
- **Transformations:** Resized to max 1200x400px, optimized quality

## Security Notes
- All passwords are hashed using bcrypt with 12 salt rounds
- JWT tokens expire after 90 days
- All inputs are validated and sanitized
- File uploads are scanned for malicious content
- CORS is configured for frontend domain only
- Rate limiting prevents abuse
- Helmet middleware adds security headers

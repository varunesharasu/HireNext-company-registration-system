# Company Registration & Verification Module

A comprehensive full-stack web application for company registration and profile management, built with React 19, Node.js, PostgreSQL, Firebase, and Cloudinary.

## 🚀 Features

- **User Authentication**: Email/password and SMS OTP verification via Firebase
- **Multi-step Registration**: Intuitive company profile creation process
- **Profile Management**: Complete CRUD operations for company profiles
- **File Upload**: Logo and banner image upload via Cloudinary
- **Responsive Design**: Mobile-first design with Material-UI components
- **Security**: JWT authentication, input validation, and sanitization
- **Real-time Updates**: Redux Toolkit for state management

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Redux Toolkit** - State management
- **Material-UI** - Component library and theming
- **React Hook Form** - Form handling and validation
- **React Query** - API data fetching and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js 20.x** - Server runtime
- **Express** - Web framework
- **PostgreSQL 15** - Database
- **JWT** - Authentication tokens (90-day validity)
- **bcrypt** - Password hashing
- **Express Validator** - Input validation
- **Helmet** - Security headers

### External Services
- **Firebase** - Authentication (email/password, SMS OTP)
- **Cloudinary** - Image storage and optimization
- **PostgreSQL** - Database hosted locally

## 📋 Prerequisites

- Node.js 20.x or higher
- PostgreSQL 15
- Firebase project with Authentication enabled
- Cloudinary account

## 🔧 Installation

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd company-registration-module
\`\`\`

### 2. Database Setup
\`\`\`bash
# Create PostgreSQL database
createdb company_registration

# Import the database schema
psql -d company_registration -f database/company_db.sql
\`\`\`

### 3. Backend Setup
\`\`\`bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration:
# - Database credentials
# - JWT secret
# - Firebase service account details
# - Cloudinary credentials

# Start development server
npm run dev
\`\`\`

### 4. Frontend Setup
\`\`\`bash
cd frontend
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your configuration:
# - Firebase client configuration
# - API base URL

# Start development server
npm run dev
\`\`\`

## 🌐 Environment Variables

### Backend (.env)
\`\`\`env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account_email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
\`\`\`

### Frontend (.env)
\`\`\`env
# Firebase Client SDK
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API
VITE_API_BASE_URL=http://localhost:5000/api
\`\`\`

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `full_name` - User's full name
- `gender` - Gender (m/f/o)
- `mobile_no` - Phone number with country code
- `is_mobile_verified` - Mobile verification status
- `is_email_verified` - Email verification status
- `signup_type` - Registration method
- `created_at` / `updated_at` - Timestamps

### Company Profile Table
- `id` - Primary key
- `owner_id` - Foreign key to users table
- `company_name` - Company name
- `address`, `city`, `state`, `country`, `postal_code` - Address fields
- `website` - Company website URL
- `logo_url`, `banner_url` - Cloudinary image URLs
- `industry` - Business industry
- `founded_date` - Company founding date
- `description` - Company description
- `social_links` - JSON object for social media links
- `created_at` / `updated_at` - Timestamps

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:userId` - Email verification
- `POST /api/auth/verify-mobile` - Mobile OTP verification

### Company Management
- `POST /api/company/register` - Create company profile
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update company profile
- `POST /api/company/upload-logo` - Upload company logo
- `POST /api/company/upload-banner` - Upload company banner

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
npm test
\`\`\`

### Frontend Tests
\`\`\`bash
cd frontend
npm test
\`\`\`

### API Testing
Use the provided Postman collection or test with curl:

\`\`\`bash
# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "full_name": "Test User",
    "gender": "m",
    "mobile_no": "+1234567890"
  }'

# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
\`\`\`

## 📱 Features Overview

### User Registration Flow
1. **Personal Information** - Name and gender selection
2. **Contact Details** - Email, password, and phone number
3. **Verification** - SMS OTP verification

### Company Registration Flow
1. **Company Details** - Name, industry, and description
2. **Address Information** - Complete address details
3. **Additional Information** - Website, founding date, social links

### Dashboard Features
- Company profile overview
- Image upload (logo and banner)
- Quick edit functionality
- Verification status indicators

### Settings Management
- Personal profile editing
- Company information updates
- Notification preferences
- Security settings
- Account deletion

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Authentication** - 90-day token validity
- **Input Validation** - Express validator middleware
- **Input Sanitization** - HTML sanitization
- **CORS Protection** - Configured for frontend domain
- **Security Headers** - Helmet middleware
- **File Upload Security** - Type and size validation

## 📱 Responsive Design

- **Mobile-first approach** - Optimized for mobile devices
- **Breakpoint system** - Material-UI responsive breakpoints
- **Touch-friendly** - Large touch targets and gestures
- **Progressive enhancement** - Works on all device sizes

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database on your hosting provider
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, DigitalOcean, etc.)

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, etc.)
3. Update API base URL in environment variables

## 📝 Development Guidelines

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Modular component structure
- Proper error handling and logging

### Git Workflow
- Feature branch workflow
- Descriptive commit messages
- Pull request reviews
- Automated testing on CI/CD

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Support

For technical support or questions, contact the development team.

---

**Note**: This application was developed as part of an internship assignment for Bluestock Fintech and follows all specified requirements including Firebase authentication, Cloudinary integration, and PostgreSQL database management.
\`\`\`

```json file="" isHidden

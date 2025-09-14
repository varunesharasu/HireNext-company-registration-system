# Company Registration Module - Setup Guide

This guide will help you set up and run the Company Registration & Verification Module locally.

## Quick Start

### Prerequisites Checklist
- [ ] Node.js 20.x or higher installed
- [ ] PostgreSQL 15 installed and running
- [ ] Firebase project created with Authentication enabled
- [ ] Cloudinary account created
- [ ] Git installed

### 1. Database Setup (5 minutes)

\`\`\`bash
# Create database
createdb company_registration

# Navigate to project directory
cd company-registration-module

# Import database schema
psql -d company_registration -f database/company_db.sql

# Verify tables were created
psql -d company_registration -c "\dt"
\`\`\`

Expected output:
\`\`\`
                List of relations
 Schema |      Name       | Type  |  Owner   
--------+-----------------+-------+----------
 public | company_profile | table | postgres
 public | users           | table | postgres
\`\`\`

### 2. Backend Setup (3 minutes)

\`\`\`bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
\`\`\`

Edit `.env` file with your credentials:
\`\`\`env
# Database (update with your PostgreSQL credentials)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_registration
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT (generate a secure secret)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Firebase Admin SDK (get from Firebase Console > Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Cloudinary (get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

Start backend server:
\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
Server running on port 5000
Connected to PostgreSQL database
\`\`\`

### 3. Frontend Setup (2 minutes)

\`\`\`bash
cd ../frontend
npm install

# Copy and configure environment
cp .env.example .env
\`\`\`

Edit `.env` file:
\`\`\`env
# Firebase Client SDK (get from Firebase Console > Project Settings > General)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
\`\`\`

Start frontend server:
\`\`\`bash
npm run dev
\`\`\`

Expected output:
\`\`\`
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
\`\`\`

### 4. Verify Setup

1. **Backend Health Check**:
   \`\`\`bash
   curl http://localhost:5000/api/health
   \`\`\`
   Expected: `{"status":"OK","message":"Server is running"}`

2. **Frontend Access**:
   Open http://localhost:5173 in your browser
   Expected: Login page should load

3. **Database Connection**:
   Check backend console for "Connected to PostgreSQL database" message

## Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `company-registration-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Enable "Phone" (for SMS OTP)

### 3. Get Configuration Keys

**For Backend (Service Account)**:
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the required fields for your `.env` file

**For Frontend (Web App)**:
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Web app" icon
4. Register your app
5. Copy the configuration object values to your `.env` file

## Cloudinary Configuration

### 1. Create Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### 2. Get API Credentials
1. Go to Dashboard
2. Copy the following from "Account Details":
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your backend `.env` file

## Testing the Application

### 1. User Registration Flow
1. Open http://localhost:5173
2. Click "Sign up here"
3. Fill out the multi-step registration form:
   - Step 1: Full Name, Gender
   - Step 2: Email, Password, Phone Number
   - Step 3: OTP Verification (use any 6-digit code for testing)

### 2. Company Registration Flow
1. After login, you'll see "No Company Profile Found"
2. Click "Create Company Profile"
3. Fill out the multi-step company form:
   - Step 1: Company Name, Industry, Description
   - Step 2: Address Details
   - Step 3: Website, Founded Date, Social Links

### 3. File Upload Testing
1. Go to Dashboard after company registration
2. Test logo upload (recommended: 300x300px image)
3. Test banner upload (recommended: 1200x400px image)

### 4. Settings Management
1. Click user menu in top-right corner
2. Select "Settings"
3. Test different tabs:
   - Profile: Edit personal information
   - Company: Edit company details
   - Notifications: Toggle preferences
   - Security: View security options

## Troubleshooting

### Common Issues

**Database Connection Error**:
\`\`\`
Error: connect ECONNREFUSED 127.0.0.1:5432
\`\`\`
Solution: Ensure PostgreSQL is running and credentials are correct

**Firebase Authentication Error**:
\`\`\`
Error: Firebase project not found
\`\`\`
Solution: Verify Firebase project ID and service account credentials

**Cloudinary Upload Error**:
\`\`\`
Error: Invalid API key
\`\`\`
Solution: Check Cloudinary credentials in backend `.env` file

**CORS Error**:
\`\`\`
Access to XMLHttpRequest blocked by CORS policy
\`\`\`
Solution: Ensure backend CORS is configured for frontend URL (http://localhost:5173)

### Debug Mode

Enable debug logging:

**Backend**:
\`\`\`bash
DEBUG=* npm run dev
\`\`\`

**Frontend**:
Add to browser console:
\`\`\`javascript
localStorage.setItem('debug', 'app:*')
\`\`\`

### Port Conflicts

If ports 5000 or 5173 are in use:

**Backend**:
\`\`\`bash
PORT=5001 npm run dev
\`\`\`

**Frontend**:
\`\`\`bash
npm run dev -- --port 5174
\`\`\`

Remember to update the API URL in frontend `.env` if you change the backend port.

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production PostgreSQL database
3. Set secure JWT secret
4. Configure proper CORS origins
5. Use HTTPS for all external services

### Frontend Deployment
1. Update `VITE_API_BASE_URL` to production backend URL
2. Build production bundle: `npm run build`
3. Deploy `dist` folder to static hosting service
4. Configure proper domain in Firebase Authentication settings

## Support

If you encounter issues not covered in this guide:
1. Check the main README.md for detailed documentation
2. Review the error logs in both backend and frontend consoles
3. Verify all environment variables are correctly set
4. Ensure all external services (Firebase, Cloudinary) are properly configured

For development questions, refer to the code comments and API documentation in the project files.

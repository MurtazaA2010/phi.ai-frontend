# Authentication System - Complete Setup

## ✅ What's Been Implemented

### Backend (Python/FastAPI)
- ✅ Complete authentication system with MongoDB
- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ Daily credit limit system (5 credits per day)
- ✅ Protected API endpoints
- ✅ Credit tracking and automatic reset

### Frontend (React/TypeScript)
- ✅ Authentication context and state management
- ✅ Sign up and Sign in pages connected to backend
- ✅ Protected routes (Workspace requires authentication)
- ✅ User info and credit display
- ✅ Automatic token management (localStorage)
- ✅ Session handling and logout

## 🚀 Quick Start

### 1. Install Backend Dependencies

```bash
cd phi.ai-studio/server
pip install -r requirements.txt
```

### 2. Configure MongoDB

Create a `.env` file in `phi.ai-studio/server/`:

```env
MONGODB_URL=your_mongodb_connection_string_here
SECRET_KEY=your-secret-key-change-this-in-production
DATABASE_NAME=phi_ai
```

**Get MongoDB Connection String:**
- Local: `mongodb://localhost:27017`
- MongoDB Atlas: Get from https://www.mongodb.com/cloud/atlas

### 3. Start Backend Server

```bash
cd phi.ai-studio/server
python -m uvicorn main:app --reload --port 8000
```

### 4. Start Frontend

```bash
cd phi.ai-studio
npm run dev
```

## 📋 API Endpoints

### Public Endpoints
- `POST /auth/signup` - Create account
- `POST /auth/signin` - Sign in

### Protected Endpoints (require JWT token)
- `GET /auth/me` - Get current user info
- `GET /auth/credits` - Get credit information
- `POST /generate-code` - Generate Manim code (uses 1 credit)
- `POST /render` - Render video (uses 1 credit)
- `POST /generate` - Generate code and render (uses 1 credit)

## 💳 Credit System

- **Daily Limit**: 5 credits per user per day
- **Reset**: Credits reset automatically at midnight (based on last_reset_date)
- **Usage**: Each generation/rendering uses 1 credit
- **Display**: Shows remaining credits in workspace header

## 🔒 Security Features

- Password hashing with bcrypt
- JWT tokens with expiration (24 hours)
- Protected API endpoints
- CORS configuration
- Token stored securely in localStorage
- Automatic session validation

## 📁 File Structure

### Backend
```
server/
├── auth/
│   ├── __init__.py
│   ├── config.py          # Configuration (MongoDB, JWT, credits)
│   ├── models.py          # User model and MongoDB setup
│   ├── schemas.py         # Pydantic schemas
│   ├── security.py        # Password hashing, JWT tokens
│   ├── dependencies.py    # FastAPI dependencies (auth, credits)
│   └── routes.py          # Auth endpoints
├── main.py                # Main FastAPI app (includes auth)
└── requirements.txt       # Python dependencies
```

### Frontend
```
src/
├── contexts/
│   └── AuthContext.tsx    # Authentication context
├── components/
│   └── ProtectedRoute.tsx # Route protection component
├── pages/
│   ├── SignIn.tsx         # Sign in page (connected to backend)
│   ├── SignUp.tsx         # Sign up page (connected to backend)
│   └── Workspace.tsx      # Protected workspace (shows credits)
└── App.tsx                # Main app (includes AuthProvider)
```

## 🎯 User Flow

1. **Sign Up**: User creates account → JWT token stored → Redirected to workspace
2. **Sign In**: User signs in → JWT token stored → Redirected to workspace
3. **Workspace**: User can generate code/videos → Credits tracked → Displayed in header
4. **Credit Limit**: When limit reached → Error message → Credits reset next day

## ⚠️ Important Notes

1. **MongoDB Required**: You must configure `MONGODB_URL` in `.env` file
2. **Secret Key**: Change `SECRET_KEY` in production
3. **CORS**: Currently allows localhost origins (update for production)
4. **Tokens**: Stored in localStorage (consider httpOnly cookies for production)

## 🐛 Troubleshooting

- **"Database not initialized"**: Check MongoDB connection string in `.env`
- **"401 Unauthorized"**: Token expired or invalid, sign in again
- **"429 Too Many Requests"**: Daily credit limit reached
- **"Email already registered"**: User already exists, try signing in

## 📝 Next Steps

1. Fill in MongoDB connection string in `.env`
2. Install dependencies
3. Start backend and frontend servers
4. Create an account and start generating!


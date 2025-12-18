# Task Management System

A full-stack task management application with authentication, built with React, Node.js, Express, and MongoDB.

## Features

- ✅ User Authentication (Register/Login) with bcrypt password hashing
- ✅ JWT-based authorization
- ✅ Beautiful UI with Tailwind CSS
- ✅ Task Management (Create, Read, Update, Delete)
- ✅ Task Status Management (Pending/Completed)
- ✅ Assign tasks to users
- ✅ Filter tasks (All, My Tasks, Pending, Completed)
- ✅ Real-time statistics dashboard
- ✅ RESTful API design

## Tech Stack

**Frontend:**

- React 19
- React Router DOM
- Tailwind CSS
- Axios
- Vite

**Backend:**

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (connection string provided)

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. The `.env` file is already configured with your MongoDB URI:

```
MONGODB_URI=mongodb+srv://root:root@cluster0.vhvms18.mongodb.net/?appName=Cluster0
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

4. Start the backend server:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. The `.env` file is already configured:

```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users` - Get all users

### Tasks (Protected Routes - Require JWT Token)

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/user/:userId` - Get tasks by user ID
- `GET /api/tasks/my-tasks` - Get logged-in user's tasks
- `PATCH /api/tasks/:taskId/status` - Update task status
- `PUT /api/tasks/:taskId` - Update task details
- `DELETE /api/tasks/:taskId` - Delete a task

## Usage

1. **Register a new account:**

   - Navigate to the register page
   - Enter your name, email, and password (minimum 6 characters)
   - Click "Sign Up"

2. **Login:**

   - Navigate to the login page
   - Enter your email and password
   - Click "Sign In"

3. **Dashboard:**
   - View statistics (Total Tasks, My Tasks, Pending, Completed)
   - Filter tasks using the filter buttons
   - Create new tasks by clicking "Create Task"
   - Assign tasks to any registered user
   - Mark tasks as completed or pending
   - Delete tasks

## Project Structure

```
backend/
├── models/
│   ├── User.js          # User model with bcrypt
│   └── Task.js          # Task model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── tasks.js         # Task management routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── .env                 # Environment variables
├── server.js            # Express server setup
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login component
│   │   ├── Register.jsx       # Register component
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── context/
│   │   └── AuthContext.jsx    # Authentication context
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── App.jsx                # Main app component
│   └── index.css              # Tailwind CSS imports
├── .env                       # Environment variables
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token-based authentication
- Protected routes on both frontend and backend
- Input validation with express-validator
- CORS enabled for secure cross-origin requests

## License

ISC

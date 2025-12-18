# Task Management Team (TMT) Task

A full-stack task management application with authentication, dark mode, and comprehensive task tracking features. Built with React, Node.js, Express, and MongoDB.

## Features

### Authentication & Security

- ✅ User Authentication (Register/Login) with bcrypt password hashing
- ✅ JWT-based authorization with token refresh
- ✅ Protected routes on both frontend and backend
- ✅ Input validation with express-validator

### Task Management

- ✅ Create, Read, Update, Delete (CRUD) operations
- ✅ Task Status Management (Pending/Completed) with PATCH support
- ✅ Assign tasks to any registered user
- ✅ Optimistic UI updates for instant feedback
- ✅ Edit task details (title, description, assignee)
- ✅ Delete confirmation modal

### Filtering & Organization

- ✅ **All Tasks** - View all tasks from all team members
- ✅ **My Tasks** - View only your assigned tasks
- ✅ **All Pending** - View all pending tasks (team-wide)
- ✅ **My Pending** - View only your pending tasks
- ✅ **All Completed** - View all completed tasks (team-wide)
- ✅ **My Completed** - View only your completed tasks

### Dashboard & Statistics

- ✅ Real-time statistics in single row view:
  - Total Tasks (all team members)
  - My Tasks (your assigned tasks)
  - All Pending (team-wide pending)
  - My Pending (your pending tasks)
  - All Completed (team-wide completed)
  - My Completed (your completed tasks)
- ✅ Color-coded stats cards with icons
- ✅ Responsive grid layout (1/2/3/6 columns)

### UI/UX

- ✅ Beautiful UI with Tailwind CSS
- ✅ Dark Mode toggle (persistent across sessions)
- ✅ Responsive design for all screen sizes
- ✅ Loading states on buttons (Creating..., Updating..., Deleting...)
- ✅ Toast notifications for success/error messages
- ✅ Smooth animations and transitions

### Deployment

- ✅ Backend deployed on Render with auto-deploy from GitHub
- ✅ CORS configured for production and development
- ✅ 30-second API timeout for Render cold starts
- ✅ Frontend ready for Netlify deployment

## Tech Stack

**Frontend:**

- React 19
- React Router DOM v7
- Tailwind CSS v3 (with dark mode support)
- Axios (30s timeout for Render)
- Vite (build tool)
- Context API (Authentication & Theme)

**Backend:**

- Node.js
- Express.js v4
- MongoDB with Mongoose v8
- JWT for authentication
- bcryptjs for password hashing (12 salt rounds)
- express-validator for input validation
- CORS with origin validation

**Deployment:**

- Backend: Render (auto-deploy from GitHub)
- Frontend: Netlify-ready configuration
- Database: MongoDB Atlas

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

3. The `.env` file should contain:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

> **Note:** Copy `.env.example` to `.env` and update with your values.

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

3. The `.env` file should contain:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, update to your Render backend URL:

```env
VITE_API_URL=https://your-app-name.onrender.com/api
```

> **Note:** Copy `.env.example` to `.env` and update with your values.

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
- `PATCH /api/tasks/:taskId/status` - Update task status (Pending/Completed)
- `PUT /api/tasks/:taskId` - Update task details (title, description, assignee)
- `DELETE /api/tasks/:taskId` - Delete a task

> **Note:** All protected routes require `Authorization: Bearer <token>` header

## Usage

1. **Register a new account:**

   - Navigate to the register page
   - Enter your name, email, and password (minimum 6 characters)
   - Click "Sign Up"

2. **Login:**

   - Navigate to the login page
   - Enter your email and password
   - Click "Sign In"
   - JWT token is stored in localStorage

3. **Dashboard Overview:**

   - View 6 statistics cards in a single row:
     - **Total Tasks**: All tasks from all team members
     - **My Tasks**: Tasks assigned to you
     - **All Pending**: All pending tasks (team-wide)
     - **My Pending**: Your pending tasks
     - **All Completed**: All completed tasks (team-wide)
     - **My Completed**: Your completed tasks
   - Toggle dark mode using the theme button in header
   - Logout using the logout button

4. **Filter Tasks:**

   - **All Tasks** - View everything
   - **My Tasks** - View only your assignments
   - **All Pending** - All team pending tasks
   - **My Pending** - Your pending tasks only
   - **All Completed** - All team completed tasks
   - **My Completed** - Your completed tasks only

5. **Create a Task:**

   - Click "Create Task" button
   - Enter task title and description
   - Select an assignee from registered users
   - Click "Create" (button shows "Creating..." during submission)
   - Task appears immediately with optimistic update

6. **Update Task Status:**

   - Click "Mark Completed" on a pending task (turns green)
   - Click "Mark Pending" on a completed task (turns orange)
   - Status updates instantly with optimistic UI

7. **Edit a Task:**

   - Click "Edit" button on any task card
   - Modify title, description, or assignee
   - Click "Update" (button shows "Updating..." during submission)
   - Changes reflect immediately

8. **Delete a Task:**
   - Click "Delete" button on any task card
   - Confirm deletion in the modal
   - Click "Delete" (button shows "Deleting..." during submission)
   - Task removed immediately with optimistic update

## Project Structure

```
backend/
├── models/
│   ├── User.js          # User model with bcrypt
│   └── Task.js          # Task model with assignee reference
├── routes/
│   ├── auth.js          # Authentication routes (register, login, users)
│   └── tasks.js         # Task CRUD & status update routes
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment template
├── server.js            # Express server with CORS config
└── package.json         # Dependencies & scripts

frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page with form validation
│   │   ├── Register.jsx       # Registration with password rules
│   │   ├── Dashboard.jsx      # Main dashboard with stats & tasks
│   │   └── ProtectedRoute.jsx # Route protection wrapper
│   ├── context/
│   │   ├── AuthContext.jsx    # Auth state & JWT management
│   │   └── ThemeContext.jsx   # Dark mode state management
│   ├── services/
│   │   └── api.js             # Axios instance & API methods
│   ├── App.jsx                # Router configuration
│   ├── main.jsx               # Entry point (no StrictMode)
│   └── index.css              # Tailwind imports
├── .env                       # Environment variables (gitignored)
├── .env.example               # Environment template
├── tailwind.config.js         # Tailwind with dark mode
├── postcss.config.js          # PostCSS configuration
├── netlify.toml               # Netlify deployment config
└── package.json               # Dependencies & scripts
```

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token-based authentication (stored in localStorage)
- Protected routes on both frontend and backend
- Input validation with express-validator
- CORS configured with origin validation:
  - Development: `http://localhost:5173`, `http://localhost:5174`
  - Production: Render backend URL
- Credentials support enabled for cookies/auth headers
- HTTP methods: GET, POST, PUT, PATCH, DELETE, OPTIONS

## Key Technical Implementations

### Frontend

- **Optimistic Updates**: UI updates immediately before API confirmation for better UX
- **Duplicate Prevention**: `useRef` to track submissions and prevent double-clicks
- **Loading States**: Buttons show "Creating...", "Updating...", "Deleting..." during operations
- **No StrictMode**: Removed to prevent double API calls in development
- **30s API Timeout**: Handles Render cold starts gracefully
- **Dark Mode**: Persistent theme using localStorage and Context API
- **Responsive Design**: 1/2/3/6 column grid layouts for different screen sizes

### Backend

- **CORS Preflight**: Explicit OPTIONS handler for all routes
- **PATCH Support**: Proper HTTP method for status updates
- **JWT Middleware**: Validates tokens on protected routes
- **Mongoose Populate**: Efficiently loads assignee details
- **Error Handling**: Comprehensive error responses with status codes

## Deployment

### Backend (Render)

1. Push code to GitHub repository
2. Render auto-deploys from `main` branch
3. Environment variables configured in Render dashboard
4. Backend URL: `https://your-app-name.onrender.com`

### Frontend (Netlify)

1. Update `.env` with production backend URL
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Netlify configuration in `netlify.toml`

## Known Issues & Solutions

### Issue: Creating 3 tasks instead of 1

**Solution**: Removed React StrictMode + implemented `useRef(isSubmitting)` to prevent duplicate submissions

### Issue: PATCH method CORS error

**Solution**: Added PATCH to allowed methods array in backend CORS configuration

### Issue: Mark complete not working

**Solution**: Implemented optimistic updates + proper PATCH endpoint with status toggle

### Issue: Render cold starts (503 errors)

**Solution**: Increased Axios timeout to 30 seconds for initial wake-up

## Future Enhancements

- [ ] Task due dates and reminders
- [ ] Task priority levels
- [ ] Task comments and attachments
- [ ] Real-time updates with WebSockets
- [ ] Task search and advanced filtering
- [ ] User profiles and avatars
- [ ] Email notifications
- [ ] Task tags and categories
- [ ] Activity log/audit trail
- [ ] Bulk task operations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

ISC

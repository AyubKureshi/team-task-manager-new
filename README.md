# Team Task Manager

## 📌 Project Overview
Team Task Manager is a full-stack Web Application built with the MERN stack (MongoDB, Express, React, Node.js). It is designed to help teams collaborate effectively by allowing administrators to create projects and assign tasks, while team members can track their assigned work and update progress.

**Live Application:** https://team-task-manager-frontend-production-db60.up.railway.app/

**GitHub Repository:** https://github.com/AyubKureshi/team-task-manager-new.git

**Demo Video:** [Insert your Video URL here]

---

## 🚀 Local Installation & Setup

To run this project locally, follow these steps:

### 1. Clone the repository
`bash
git clone https://github.com/AyubKureshi/team-task-manager-new.git
cd team-task-manager-new
`

### 2. Backend Setup
`bash
cd backend
npm install
`
Create a `.env` file in the `/backend` directory and add the following environment variables:
`env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
`
Start the backend development server:
`bash
npm run dev
`

### 3. Frontend Setup
Open a new terminal window:
`bash
cd frontend
npm install
`
Create a `.env` file in the `/frontend` directory and add the following environment variable:
`env
VITE_API_URL=http://localhost:5000/api
`
Start the frontend development server:
`bash
npm run dev
`

---

## 📡 API Endpoints Reference

### Authentication
*   **POST** `/api/auth/signup` - Register a new user
*   **POST** `/api/auth/login` - Authenticate user & get token

### Projects
*   **POST** `/api/projects` - Create a new project (Admin only)
*   **GET** `/api/projects` - Get all projects

### Tasks
*   **POST** `/api/tasks` - Create and assign a task (Admin only)
*   **GET** `/api/tasks` - Get tasks (Filtered by user role)
*   **PUT** `/api/tasks/:id` - Update task status (Pending, In Progress, Completed)

### Users
*   **GET** `/api/users` - Get all users for task assignment (Admin only)

---

## 👤 Author
*   **Name:** Ayub Kureshi
*   **Email:** ayubkureshi21@gmail.com
*   **Submission Date:** 01-Apr-2026

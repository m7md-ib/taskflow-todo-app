# Taskflow — Full-Stack To-Do List App

A modern, full-stack to-do list application built with **React + Vite**, **Node.js + Express**, and **MongoDB**.

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   └── taskController.js  # CRUD logic
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handling
│   ├── models/
│   │   └── Task.js            # Mongoose schema
│   ├── routes/
│   │   └── taskRoutes.js      # Express routes + validation
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FilterBar.jsx  # Filter + Search bar
    │   │   ├── Header.jsx     # App header + dark mode
    │   │   ├── TaskCard.jsx   # Individual task card
    │   │   ├── TaskForm.jsx   # Add task form
    │   │   └── TaskList.jsx   # Task list container
    │   ├── context/
    │   │   └── TaskContext.jsx # Global state (useReducer)
    │   ├── hooks/
    │   │   └── useLocalStorage.js
    │   ├── pages/
    │   │   └── Home.jsx
    │   ├── services/
    │   │   └── api.js         # All fetch calls
    │   ├── styles/
    │   │   └── global.css
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

---

### 1. Clone the Repository

```bash
git clone <repo-url>
cd todo-app
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB URI:

```env
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Using MongoDB Atlas?** Replace `MONGODB_URI` with your Atlas connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todoapp
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API will be live at `http://localhost:5000`.

---

### 3. Set Up the Frontend

```bash
cd ../frontend
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The app will be live at **`http://localhost:5173`** 🎉

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                  |
|--------|--------------------|------------------------------|
| GET    | `/tasks`           | Fetch all tasks              |
| GET    | `/tasks?status=pending` | Filter by status        |
| GET    | `/tasks?search=foo`| Search by title/description  |
| POST   | `/tasks`           | Create a new task            |
| PUT    | `/tasks/:id`       | Update a task                |
| DELETE | `/tasks/:id`       | Delete a task                |
| DELETE | `/tasks/completed` | Bulk delete completed tasks  |

### Task Schema

```json
{
  "title": "string (required, max 200)",
  "description": "string (optional, max 1000)",
  "status": "pending | completed (default: pending)",
  "dueDate": "ISO date string (optional)",
  "createdAt": "auto",
  "updatedAt": "auto"
}
```

---

## ✨ Features

- **Full CRUD** — Create, read, update, delete tasks
- **Filter** — All / Pending / Completed
- **Search** — Debounced real-time search on title & description
- **Toggle status** — Click the circle to complete/undo a task
- **Inline editing** — Edit title, description, and due date directly in the card
- **Bulk delete** — Clear all completed tasks at once
- **Due date tracking** — Overdue tasks are highlighted
- **Dark mode** — Persisted via localStorage
- **Animations** — Framer Motion throughout
- **Responsive** — Works on mobile and desktop
- **Toast notifications** — react-hot-toast for user feedback
- **Loading skeletons** — Smooth loading experience
- **Input validation** — Both client-side and server-side
- **Error handling** — Graceful error states in UI and API

---

## 🛠 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, Framer Motion     |
| Styles   | CSS Modules, custom design tokens |
| State    | Context API + useReducer          |
| Backend  | Node.js, Express 4                |
| Database | MongoDB, Mongoose 8               |
| Fonts    | Syne (display), DM Sans (body)    |

---

## 🧩 Environment Variables Reference

### Backend (`backend/.env`)

| Variable      | Description                   | Default                              |
|---------------|-------------------------------|--------------------------------------|
| MONGODB_URI   | MongoDB connection string      | `mongodb://localhost:27017/todoapp`  |
| PORT          | Server port                   | `5000`                               |
| NODE_ENV      | Environment                   | `development`                        |
| CLIENT_URL    | Frontend URL (for CORS)       | `http://localhost:5173`              |

### Frontend (`frontend/.env`)

| Variable           | Description       | Default                   |
|--------------------|-------------------|---------------------------|
| VITE_API_BASE_URL  | Backend API URL   | `http://localhost:5000`   |

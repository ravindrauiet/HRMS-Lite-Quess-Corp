# HRMS Lite

A lightweight Human Resource Management System built with **React** (Frontend) and **FastAPI** (Backend).

## Project Overview
HRMS Lite is a web-based application designed for efficient employee and attendance management.
- **Admin Features:**
  - Onboard new employees.
  - View and delete employee records.
  - Mark daily attendance (Present/Absent).
  - View attendance history per employee.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS
- **Backend:** FastAPI, Python, SQLAlchemy
- **Database:** SQLite (File-based)

## Setup Instructions

### Prerequisites
- Node.js & npm
- Python 3.8+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
The backend API will start at `http://127.0.0.1:8000`.
Docs available at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend application will run at `http://localhost:5173`.

## Environment Variables
To connect the frontend to a deployed backend, create a `.env` file in the `frontend` directory:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## Assumptions & Limitations
- **Authentication:** As per requirements, no login/auth is implemented (Single Admin assumption).
- **Database:** Uses SQLite for simplicity; data is stored in `backend/sql_app.db`.
- **Validation:** Basic duplicate email checks and format validation are implemented.

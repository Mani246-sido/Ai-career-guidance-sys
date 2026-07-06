# Vector – AI Career Operating System

Vector is a full-stack web application that helps students plan and improve their careers using AI-powered tools. It combines career prediction, resume analysis, mock interviews, virtual internships, skill gap analysis, and personalized roadmaps into a single platform.

The goal of this project is to give students a practical way to understand where they stand today and what they should work on next.


![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![License](https://img.shields.io/badge/License-MIT-orange)

## Features

- Secure user authentication (JWT)
- Student profile management
- AI Career Prediction
- Resume Analyzer
- AI Mock Interview
- Virtual Internship Simulator
- Skill Gap Analysis
- Personalized Learning Roadmap
- Dashboard with progress tracking
- Notifications
- Admin Panel

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Zustand
- Framer Motion
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Multer
- Cloudinary

### AI

- OpenAI API

---

## Folder Structure

```
Vector/
│
├── frontend/
│
└── backend/
```

---

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>

cd Vector
```

---

### 2. Install Backend

```bash
cd backend

npm install
```

---

### 3. Install Frontend

```bash
cd ../frontend

npm install
```

---

## Environment Variables

### Backend (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

JWT_REFRESH_SECRET=your_refresh_secret

JWT_EXPIRES_IN=1d

JWT_REFRESH_EXPIRES_IN=10d

CLIENT_URL=http://localhost:5173

OPENAI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Project

### Backend

```bash
cd backend

npm run dev
```

Backend runs on

```
http://localhost:5000
```

---

### Frontend

```bash
cd frontend

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

## Main API Routes

| Method | Endpoint |
|----------|-----------------------------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/logout |
| GET | /api/profile |
| PUT | /api/profile |
| POST | /api/profile/resume |
| POST | /api/career/predict |
| POST | /api/interview/start |
| POST | /api/interview/feedback |
| POST | /api/roadmap/generate |
| GET | /api/dashboard |
| POST | /api/skills/gap-analysis |

---

## Authentication

Protected routes require a valid access token.

```
Authorization: Bearer <access_token>
```

---

## Screens

- Landing Page
- Login & Signup
- Dashboard
- Career Prediction
- Resume Analyzer
- AI Interview
- Virtual Internship
- Skill Gap Analysis
- Learning Roadmap
- Profile

---

## Future Improvements

- Company-specific interview preparation
- Real-time coding interview environment
- Resume ATS scoring improvements
- Placement analytics
- AI career mentor chatbot
- Community discussion section
- Multi-language support

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

## License

This project is intended for educational and learning purposes.

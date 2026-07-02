# AI CAREER GUIDE SYSTEM

AI-powered Career Operating System — Backend (Node.js + Express + MongoDB + OpenAI)

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT (access + refresh tokens)
- Bcrypt (password hashing)
- Multer (file upload, PDF/DOC/DOCX only) + Cloudinary (file storage)
- pdf-parse (auto text extraction from uploaded PDF resumes)
- express-validator (input validation)
- helmet + express-rate-limit (security hardening)
- OpenAI API (AI logic for career prediction, resume analysis, internship review, interview feedback)

---

## 1. Prerequisites

- Node.js (v18 or above)
- MongoDB (local install OR MongoDB Atlas account)
- OpenAI API key (https://platform.openai.com/api-keys)
- Cloudinary account (https://cloudinary.com) — free tier is enough

---


| Variable | What it is | Where to get it |
|---|---|---|
| `PORT` | Port the server runs on | Keep `5000`, or change if busy |
| `MONGO_URI` | MongoDB connection string | Local: `mongodb://localhost:27017/career-os` <br> Atlas: from Atlas dashboard → Connect → Drivers |
| `JWT_SECRET` | Secret to sign access tokens | Any long random string (e.g. generate with `openssl rand -base64 32`) |
| `JWT_EXPIRES_IN` | Access token validity | Keep `7d`, or change as needed |
| `JWT_REFRESH_SECRET` | Secret to sign refresh tokens | Another random string, different from `JWT_SECRET` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token validity | Keep `30d` |
| `OPENAI_API_KEY` | Key for all AI features | https://platform.openai.com/api-keys → Create new secret key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | Cloudinary Dashboard → top of page |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Cloudinary Dashboard → API Keys section |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Cloudinary Dashboard → API Keys section |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:3000` during development |

### Generating random secrets (JWT_SECRET, JWT_REFRESH_SECRET)

Run this in terminal, do it twice for two different secrets:

```bash
openssl rand -base64 32
```

If `openssl` is not available, any long random string works for development.

---

## 4. MongoDB Setup

### Option A — Local MongoDB
1. Install MongoDB Community Server
2. Start it (`mongod`)
3. Use: `MONGO_URI=mongodb://localhost:27017/career-os`

### Option B — MongoDB Atlas (recommended, free)
1. Create account at https://cloud.mongodb.com
2. Create a free cluster
3. Database Access → create a user with password
4. Network Access → allow your IP (or `0.0.0.0/0` for dev)
5. Connect → Drivers → copy the connection string
6. Replace `<password>` with your DB user password, add `/career-os` before the `?`

---

## 5. Cloudinary Setup (for resume uploads)

1. Sign up at https://cloudinary.com
2. Dashboard shows: Cloud Name, API Key, API Secret directly — copy into `.env`
3. No bucket/folder creation needed, code auto-creates the folder on first upload

---

## 6. OpenAI Setup (for AI features)

1. Sign up / log in at https://platform.openai.com
2. Go to API Keys → Create new secret key
3. Add billing (OpenAI requires a payment method even for small usage)
4. Paste key into `OPENAI_API_KEY`

Note: All AI functions have fallback responses if the OpenAI call fails (rate limit, no key, etc.) so the app won't crash — but real AI-personalized output needs a valid key with credits.

---

## 7. Running the server

Development (auto-restart on changes):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs at: `http://localhost:5000`
Health check: `GET http://localhost:5000/` → "Career OS API is running"

All routes are prefixed with `/api`, e.g. `http://localhost:5000/api/auth/register`

---

## 8. Folder Structure

```
server/
  config/        → db.js, cloudinary.js
  models/        → User, Profile, Assessment, CareerPrediction, Internship,
                    Task, ResumeReport, InterviewReport, Roadmap, Notification, SkillGapAnalysis
  middleware/     → auth, admin, error, notFound, validate, rateLimiter, upload
  utils/          → ApiError, ApiResponse, asyncHandler, generateToken
  validators/     → auth, profile, career, internship, interview input validation rules
  controllers/    → auth, profile, assessment, career, internship,
                    resume, interview, roadmap, dashboard, notification, skill, admin
  routes/routes.js → all routes consolidated here
  services/       → notification.service.js + ai/ (OpenAI logic per module, including skill.ai.js)
  app.js
server.js          → entry point
```

---

## 9. API Routes Reference

| Method | Route | Auth Required |
|---|---|---|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| POST | /api/auth/logout | Yes |
| POST | /api/auth/refresh | No |
| GET | /api/profile | Yes |
| PUT | /api/profile | Yes |
| POST | /api/profile/resume | Yes (multipart, field name: `resume`) |
| POST | /api/assessment | Yes |
| GET | /api/assessment/history | Yes |
| POST | /api/career/predict | Yes |
| GET | /api/career/history | Yes |
| POST | /api/internship/start | Yes |
| GET | /api/internship/tasks?internshipId=... | Yes |
| POST | /api/internship/submit | Yes |
| POST | /api/resume/analyze | Yes |
| GET | /api/resume/reports | Yes |
| POST | /api/interview/start | Yes |
| POST | /api/interview/feedback | Yes |
| POST | /api/roadmap/generate | Yes |
| GET | /api/roadmap | Yes |
| GET | /api/dashboard | Yes |
| GET | /api/notifications | Yes |
| PATCH | /api/notifications/:notificationId/read | Yes |
| PATCH | /api/notifications/read-all | Yes |
| POST | /api/skills/gap-analysis | Yes |
| GET | /api/skills/gap-analysis/history | Yes |
| GET | /api/admin/users | Yes (Admin only) |
| GET | /api/admin/users/:userId | Yes (Admin only) |
| PATCH | /api/admin/users/:userId/role | Yes (Admin only) |
| DELETE | /api/admin/users/:userId | Yes (Admin only) |
| GET | /api/admin/stats | Yes (Admin only) |

For protected routes, send token as:
`Authorization: Bearer <accessToken>`
(or it auto-reads from cookies if using a browser client with credentials)

### Resume flow (updated)

1. `POST /api/profile/resume` with a `multipart/form-data` body, field name `resume`, file type PDF/DOC/DOCX only (10MB max)
2. If the file is a PDF, text is auto-extracted and saved to the profile (`resumeText`)
3. `POST /api/resume/analyze` — you can call this with an empty body now; it automatically uses the stored `resumeText` from the last uploaded resume. You can still pass `{ "resumeText": "..." }` manually to override.

### Notifications

Notifications are created automatically on key events (career prediction generated, internship completed). Use `GET /api/notifications` to list them, and the `PATCH` routes to mark as read.

### Rate limiting

- Auth routes (`/auth/register`, `/auth/login`): max 20 requests per 15 minutes per IP
- All other `/api/*` routes: max 200 requests per 15 minutes per IP

### Admin Panel

`User` model has a `role` field (`student` or `admin`, default `student`). To make a user an admin, manually update it in the database once (e.g. via MongoDB Compass or shell):

```js
db.users.updateOne({ email: "youradmin@email.com" }, { $set: { role: "admin" } })
```

After that, all `/api/admin/*` routes work for that user's token — view all users (paginated), view a single user's profile, change roles, delete users, and view platform-wide stats (total users, assessments, predictions, internships, reports).

### Skill Gap Analysis

`POST /api/skills/gap-analysis` with `{ "targetRole": "Frontend Developer" }` (or it falls back to the role saved in your profile). Compares your current skills (from profile) against AI-determined required skills for that role, returns `missingSkills`, `matchPercentage`, and `recommendations`. History available via `GET /api/skills/gap-analysis/history`.

### Learning Resources

Roadmap milestones now include a `resources` array (course/video/article/documentation/practice links) generated by AI alongside each milestone. Use `PATCH /api/roadmap/:roadmapId/milestone/:milestoneIndex` with `{ "completed": true }` to mark a milestone done.

---

## 10. Testing Quickly (Postman / Thunder Client)

1. `POST /api/auth/register` → body: `{ "name": "Test", "email": "test@test.com", "password": "123456" }`
2. Copy `accessToken` from response
3. Use it in `Authorization: Bearer <token>` header for any protected route
4. `GET /api/dashboard` should return empty/default values for a fresh user

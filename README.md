# ResuMochi  – AI-Powered Resume Builder & Career Assistant

ResuMochi is a full-stack career preparation and resume building web application. Leveraging the Google Gemini API, it provides intelligent resume generation, section-by-section optimization, real-time ATS compatibility scoring, and tailored interview preparation based on active job listings.

---

## Key Features

- **Interactive Resume Editor:** Live markdown/form editor supporting sections for Experience, Education, Skills, and Projects.
- **AI Bullet Enhancer:** Refines raw achievements into impactful, action-driven bullet points using Google Gemini.
- **ATS Compatibility Scorer:** Evaluates resume text against target job descriptions and provides an actionable match rating.
- **Job Matching & Discovery:** Pre-configured mock and local job opportunities with tailored requirement mapping.
- **Instant Export:** Export generated resumes directly to formatted PDF or print-ready layouts.
- **Secure Architecture:** Environment-isolated API credentials, token-based session handling, and clean schema validation.

---

## Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js (`server.ts`) |
| **AI Integration** | Google Gemini API (`@google/genai` SDK) |
| **Database** | MongoDB / In-Memory Mock Store (Mongoose models ready) |
| **Styling** | Tailwind CSS (Mochi-themed responsive UI) |
| **Version Control** | Git & GitHub |

---

## Database Schema

The core domain model includes Users, Resumes, and Job Listings:

```text
Users
 ├── user_id (PK, ObjectId/UUID)
 ├── name (String)
 ├── email (String, Unique)
 ├── password_hash (String)
 └── created_at (Timestamp)

Resumes
 ├── resume_id (PK, ObjectId/UUID)
 ├── user_id (FK -> Users.user_id)
 ├── title (String)
 ├── summary (Text)
 ├── experience (Array of WorkHistory Objects)
 ├── education (Array of Education Objects)
 ├── skills (Array of Strings)
 ├── ats_score (Number)
 └── updated_at (Timestamp)

Jobs
 ├── job_id (PK, ObjectId/UUID)
 ├── title (String)
 ├── company (String)
 ├── location (String)
 ├── requirements (Array of Strings)
 └── description (Text)

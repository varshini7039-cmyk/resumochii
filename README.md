The code has uploaded to your GitHub repository (`main -> main`).

Now update the **`README.md`** file so your project has the complete documentation, features list, schema, and API setup ready for submission.

---

**Step 1: Open GitHub in Your Browser**

Go to your repository link:

```text
https://github.com/varshini7039-cmyk/resumochii

```

Refresh the page.

---

**Step 2: Edit `README.md**`

1. Click on **`README.md`** in your file list.
2. Click the **pencil icon** (Edit this file) in the top-right corner.
3. Click inside the text editor box, press **Ctrl + A**, and then paste this complete Markdown content:

```markdown
# ResuMochi 🍡 – AI-Powered Resume Builder & Career Assistant

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

```

---

## Installation & Setup Guide

### 1. Prerequisites

* **Node.js** (v18.x or higher)
* **npm** (v9.x or higher)
* A valid **Gemini API Key** from Google AI Studio

### 2. Clone the Repository

```bash
git clone [https://github.com/varshini7039-cmyk/resumochii.git](https://github.com/varshini7039-cmyk/resumochii.git)
cd resumochi

```

### 3. Install Dependencies

```bash
npm install --legacy-peer-deps

```

### 4. Configure Environment Variables

Duplicate `.env.example` to create your `.env` file:

```bash
cp .env.example .env

```

Open `.env` and set your credentials:

```env
GEMINI_API_KEY="your_actual_gemini_api_key_here"
PORT=3000
MONGODB_URI="mongodb://localhost:27017/resumochi"
JWT_SECRET="resumochi_super_secret_jwt_key_2026"

```

### 5. Start the Development Server

```bash
npm run dev

```

Visit the running application in your web browser:

```text
http://localhost:3000

```

---

## API Endpoints

### AI Services

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/ai/enhance-bullet` | Enhances an achievement point using Gemini. |
| `POST` | `/api/ai/ats-score` | Analyzes resume against job description keywords. |
| `POST` | `/api/ai/generate-summary` | Drafts a tailored professional summary. |

### Resume & Job Management

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/resumes` | Retrieves resumes associated with the user account. |
| `POST` | `/api/resumes` | Saves or updates a resume draft. |
| `GET` | `/api/jobs` | Fetches available career roles and descriptions. |





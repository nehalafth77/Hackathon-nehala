# 🎓 StudySphere
> *"From scattered chats to a smarter study space."*

**StudySphere** is a centralized, collaborative, and AI-powered study platform designed to replace chaotic WhatsApp groups and fragmented cloud drives with a unified academic hub.

---

## 🌟 Key Features

### 👨‍🎓 Student Portal
- **Centralized Resource Hub**: Filter study notes, previous year question papers (PYQs), assignments, lecture slides, and curated links by branch, semester, and subject.
- **Verification & Badging**: Instantly identify faculty-verified notes, official syllabus handouts, and high-yield exam preparation materials.
- **Smart Resource Detail Viewer**:
  - Embedded YouTube video playback for lecture links
  - Direct PDF and document download
  - Community helpfulness counter and bookmarks
  - Inaccuracy / spam reporting modal
- **AI Study Assistant (24/7 Academic Tutor)**:
  - **Doubt Solver**: Interactive chat for technical doubt resolution with code snippets and analogies.
  - **Auto Quiz Generator**: Dynamic 5-question multiple choice quizzes based on subjects/topics with instant self-evaluation.
  - **Fast Revision Sheets**: 1-click summaries that condense units into bullet points, formulas, and key concepts.
  - **ELI5 Concept Explanations**: Analogies for complex computer science topics.
- **Instant Search**: Fast filterable search with topic chips and trending exam tags.
- **Department Notices**: Official announcements from faculty with priority badges (*Urgent*, *High Priority*, *General*).

### 👩‍🏫 Faculty / Teacher Portal
- **Verification Queue**: Review peer-uploaded materials, approve with **"Official"** and **"Exam Prep"** badges, provide feedback notes, or reject with clear reasons.
- **Direct Faculty Publishing**: Upload authoritative lecture slides, syllabi, and model question papers directly.
- **Broadcast System**: Publish notices targeted to specific semesters or the entire cohort with pin-to-top support.
- **Content Moderation**: Review student-flagged content to dismiss false alarms or remove outdated/inaccurate resources.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Axios, React Router v7, React Hot Toast
- **Backend**: Node.js, Express.js (ES Modules), MongoDB & Mongoose, JWT Authentication, Multer file upload
- **AI Integration**: Google Gemini API integration with offline mock fallbacks for seamless evaluation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (optional for demo mode with mock data)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nehalafth77/Hackathon-nehala.git
   cd Hackathon-nehala
   ```

2. **Frontend Setup:**
   ```bash
   npm install
   npm run dev
   ```
   The client runs on `http://localhost:5173`.

3. **Backend Setup:**
   ```bash
   cd server
   npm install
   cp .env.example .env
   node server.js
   ```
   The backend API runs on `http://localhost:5000`.

---

## 👥 Demo Access
Use the 1-click **Demo Student** or **Demo Teacher** quick-fill buttons on the login page for instant hackathon evaluation!

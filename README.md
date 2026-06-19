# Rakesh Kumar Mandal — MERN Stack Developer Portfolio

A full-stack developer portfolio built from scratch with a dark glassmorphic UI, Three.js particle background, and a complete custom-built admin dashboard — not a template.

🔗 **Live Site**: [https://rakeshkumarmandal.vercel.app/](https://rakeshkumarmandal.vercel.app/)
🔗 **GitHub**: [github.com/rakeshkumar-mandal](https://github.com/rakeshkumar-mandal)
📧 **Contact**: rakeshmandaltech@gmail.com
💼 **LinkedIn**: [linkedin.com/in/rakesh-kumar-mandal](https://www.linkedin.com/in/rakesh-kumar-mandal/)

---

## Why this project

Most student portfolios are static one-pagers. This one is a real full-stack application — the admin dashboard lets me add, edit, and manage projects without touching code, track visitor analytics, and receive contact form messages directly to my inbox. Built to demonstrate practical MERN stack skills, not just a UI clone.

---

## Features

**Public site**
- Three.js animated particle background (mouse-reactive on desktop)
- Typing animation cycling through role titles
- Scroll-triggered animated skill bars
- Projects pulled live from MongoDB
- Experience timeline, certifications, GitHub stats
- Contact form with email notifications (Resend)
- Resume download with tracking
- Fully responsive — tested on mobile, tablet, desktop

**Admin dashboard** (JWT-protected, fully responsive with mobile hamburger nav)
- Add / edit / delete projects without redeploying
- Toggle project visibility on/off
- View and manage contact messages (mark read, delete)
- Visitor analytics — total visits, today, this week, unique IPs
- Rate-limited login and contact endpoints

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Three.js |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcrypt |
| Email | Resend |
| Deployment | Vercel (frontend) · Render (backend) |
| Security | Helmet, CORS, express-rate-limit |

---

## Project structure

```
portfolio-mern/
├── server/                # Express REST API
│   ├── middleware/         # auth, rate limiting
│   ├── models/              # User, Project, Message, Analytics
│   ├── routes/                # auth, projects, contact, analytics, resume
│   └── utils/seeder.js     # seeds admin user + sample projects
└── client/                 # React + Vite frontend
    ├── src/components/      # Navbar, Hero, Skills, Projects, etc.
    ├── src/pages/            # Home, AdminLogin, Admin, NotFound
    ├── src/context/          # AuthContext (JWT session)
    └── src/utils/api.js     # Axios instance + auth interceptor
```

---

## Run locally

```bash
git clone https://github.com/rakeshkumar-mandal/rakesh-mandal-portfolio
cd rakesh-mandal-portfolio
npm run install-all
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_random_secret_min_32_chars
JWT_EXPIRE=7d
RESEND_API_KEY=your_resend_api_key
EMAIL_TO=where_you_want_notifications@gmail.com
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=YourSecurePassword123
```

```bash
npm run seed   # creates admin user + sample projects
npm run dev    # runs client (5173) + server (5000)
```

---

## API endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | — | Admin login |
| GET | `/api/projects` | — | Public visible projects |
| GET | `/api/projects/all` | ✓ | All projects (admin) |
| POST | `/api/projects` | ✓ | Create project |
| PUT | `/api/projects/:id` | ✓ | Update project |
| DELETE | `/api/projects/:id` | ✓ | Delete project |
| POST | `/api/contact` | — | Submit contact form |
| GET | `/api/contact` | ✓ | View messages |
| POST | `/api/analytics` | — | Track page visit |
| GET | `/api/analytics` | ✓ | View analytics |
| GET | `/api/resume/download` | — | Download resume |

---

## About me

Final-year B.Tech CSE student, MERN stack developer focused on building real, working products rather than tutorial clones. Currently grinding DSA in C++ and preparing for SDE roles.
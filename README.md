# 🚀 MERN Portfolio — Full-Stack Developer Portfolio

A premium, production-grade **MERN Stack portfolio** with a dark glassmorphic design, Three.js particle background, animated skill bars, and a full admin dashboard.

---

## ✨ Features

### Portfolio (Public)
- ⚡ **Three.js animated star background** in the hero section
- 🔤 **Typing animation** cycling through dev roles
- 📊 **Animated skill bars** triggered on scroll (IntersectionObserver)
- 🃏 **Project cards** fetched from MongoDB (with demo fallback)
- 📜 **Experience timeline** with glowing dots
- 🐙 **GitHub contribution grid** visualization
- 🏆 **Certifications** section
- 📄 **Resume download** section
- 📬 **Contact form** with email notification + auto-reply
- ♾️ **Infinite marquee** tech stack band
- 🌊 **Scroll reveal animations** on all sections

### Admin Dashboard (Protected)
- 🔐 **JWT authentication** (bcrypt password hashing)
- 📊 **Analytics overview** — total visits, today, week, unique IPs
- 🚀 **Project management** — add, toggle visibility, delete
- 📩 **Message center** — mark read, delete, view all
- 🛡️ **Rate limiting** on login (10/hr) and contact (5/15min)

---

## 📁 Project Structure

```
portfolio-mern/
├── package.json           # Root: runs both servers with concurrently
├── server/                # Express.js REST API
│   ├── .env               # ⚠️ Fill this before running!
│   ├── index.js           # Main app entry
│   ├── middleware/        # auth.js, rateLimiter.js
│   ├── models/            # User, Project, Message, Analytics
│   ├── routes/            # auth, projects, contact, analytics, resume
│   ├── utils/seeder.js    # Seed admin + 6 default projects
│   └── uploads/           # Place resume.pdf here
└── client/                # React + Vite frontend
    ├── vite.config.js      # /api proxy → localhost:5000
    ├── src/
    │   ├── App.jsx         # Routes + ProtectedRoute
    │   ├── index.css       # Full design system (dark theme)
    │   ├── components/     # 13 components
    │   ├── pages/          # Home, AdminLogin, Admin, NotFound
    │   ├── context/        # AuthContext
    │   ├── hooks/          # useScrollReveal
    │   └── utils/          # api.js (axios + JWT interceptor)
```

---

## 🔧 Setup & Run

### Step 1 — Fill Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/portfolio
JWT_SECRET=any_long_random_string_min_32_chars
JWT_EXPIRE=7d
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16char_app_password
EMAIL_TO=where_to_receive_notifications@gmail.com
CLIENT_URL=http://localhost:5173
NODE_ENV=development
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=YourSecurePassword123
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate 16-char password

### Step 2 — Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Admin user (email + hashed password)
- ✅ 6 default projects (AI Resume Builder, E-Commerce, etc.)

### Step 3 — Add Your Resume (Optional)

Place your `resume.pdf` in `server/uploads/resume.pdf`

### Step 4 — Run Development Servers

```bash
npm run dev
```

This starts both:
- **Server**: http://localhost:5000
- **Client**: http://localhost:5173

### Step 5 — Access the App

| URL | Description |
|-----|-------------|
| `http://localhost:5173` | Portfolio (public) |
| `http://localhost:5173/admin/login` | Admin login |
| `http://localhost:5000/api/health` | API health check |

---

## 🔑 Admin Credentials

Use the values you set in `.env`:
- **Email**: `admin@portfolio.com` (or your `ADMIN_EMAIL`)
- **Password**: `Admin@123` (or your `ADMIN_PASSWORD`)

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | No | Admin login |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/projects` | No | Get visible projects |
| GET | `/api/projects/all` | Yes | Get all projects (admin) |
| POST | `/api/projects` | Yes | Create project |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |
| POST | `/api/contact` | No | Send message (rate limited) |
| GET | `/api/contact` | Yes | Get all messages |
| PUT | `/api/contact/:id/read` | Yes | Mark as read |
| DELETE | `/api/contact/:id` | Yes | Delete message |
| POST | `/api/analytics` | No | Track page visit |
| GET | `/api/analytics` | Yes | Get analytics stats |
| GET | `/api/resume/download` | No | Download resume PDF |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7 |
| Styling | Vanilla CSS (dark glassmorphic design) |
| 3D/Animation | Three.js, CSS animations |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail) |
| HTTP Client | Axios |
| Security | Helmet, CORS, express-rate-limit |
| Dev | Nodemon, Concurrently |

---

## 📦 Scripts

```bash
npm run dev          # Start both server + client
npm run server       # Server only (port 5000)
npm run client       # Client only (port 5173)
npm run build        # Build client for production
npm run seed         # Seed DB with admin + sample projects
npm run install-all  # Install all dependencies
```

---

## 🚀 Deployment

### Server (Render / Railway)
1. Push to GitHub
2. Create new Web Service on Render
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add all `.env` variables in dashboard

### Client (Vercel)
1. Import GitHub repo
2. Set root to `client/`
3. Add `VITE_API_URL=https://your-render-url.onrender.com/api`
4. Update `vite.config.js` proxy for production

---

Built with ❤️ using MERN Stack

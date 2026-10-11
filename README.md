# LaunchBridge - Full-Stack Node.js & React Platform

A high-velocity platform connecting early-stage startups with investors, enterprise corporate pilots, and government grants. Built as a full-stack **Node.js product** with an Express REST API backend and a Vite + React frontend.

---

## 🏗️ Architecture

```
Launchpad/
├── server/                      # Node.js Express REST API backend
│   ├── server.js                # Express app entry point
│   ├── data/
│   │   ├── db.js                # Persistence database engine
│   │   ├── seedData.js          # Platform seed data
│   │   └── db.json              # Local persistent JSON database
│   └── routes/
│       ├── authRoutes.js        # /api/auth (login, register, forgot-password)
│       ├── schemeRoutes.js      # /api/schemes (CRUD for investment/pilot/grant schemes)
│       ├── applicationRoutes.js # /api/applications (submit proposals, status updates)
│       └── userRoutes.js        # /api/users, /api/all-data, /api/reset-seed
│
├── src/                         # Frontend React UI (Vite)
│   ├── context/AppContext.jsx   # State management & server sync
│   ├── services/api.js          # API client for backend communication
│   ├── components/              # Reusable UI components (Navbar, Modal, Toast)
│   └── views/                   # Views (Home, Login, Register, Apply, Status, etc.)
│
├── .env                         # Server environment configuration
├── vite.config.js               # Vite config with API proxy to port 5001
└── package.json                 # Scripts for full-stack, frontend, and backend execution
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full-Stack Application
Runs both the Node.js backend (with `nodemon` auto-reload on port `5001`) and the Vite React frontend (on port `3000`/`5173`) concurrently:
```bash
npm run dev
```

### 3. Individual Component Scripts
- **Frontend only**: `npm run client:dev`
- **Backend only**: `npm run server:dev`
- **Build production bundle**: `npm run build`
- **Start production server**: `npm start`

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | API health check |
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/forgot-password` | Password hint lookup |
| `GET` | `/api/schemes` | List schemes (filter by `type`, `dept`, `ownerId`) |
| `POST` | `/api/schemes` | Create new scheme |
| `PUT` | `/api/schemes/:id` | Update scheme details |
| `DELETE` | `/api/schemes/:id` | Delete scheme & applications |
| `GET` | `/api/applications` | List applications (filter by `userId`, `schemeId`) |
| `POST` | `/api/applications` | Submit application with document |
| `PATCH` | `/api/applications/:id/status` | Update status (Accepted, Rejected, Registered) |
| `PUT` | `/api/users/:id` | Update profile information |
| `POST` | `/api/reset-seed` | Restore platform seed data |

---

## 🔑 Demo Accounts (Password: `demo123`)

- **Startup**: `startup@demo.in`
- **Investor**: `investor@demo.in`
- **Pilot**: `pilot@demo.in`
- **Grant**: `grant@demo.in`

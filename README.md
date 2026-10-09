# Joyice Neelavathy — Full-Stack Portfolio Application

A modern, responsive full-stack personal portfolio web application built with **React**, **TypeScript**, **Bootstrap 5**, **Node.js**, **Express.js**, **MongoDB**, and documented with **Swagger / OpenAPI**.

---

## 📌 Technologies Used

### Frontend (`client/`)
- **React 18** & **TypeScript**
- **Bootstrap 5.3** & **Bootstrap Icons**
- **React Router 6**
- **Axios** (Centralized API service layer in `src/services/api.ts`)
- **Vite** build tooling

### Backend (`server/`)
- **Node.js** & **Express.js** with **TypeScript**
- **REST API** with complete CRUD endpoints
- **Swagger / OpenAPI 3.0** interactive documentation at `/api-docs`
- **Mongoose ODM** with MongoDB
- Robust error handling with automatic fallback data if MongoDB daemon is offline

---

## 📂 Project Structure

```text
profile/
├── client/                               # Frontend React + TypeScript application
│   ├── public/
│   │   └── resume.pdf                   # Downloadable resume
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx               # Responsive Bootstrap navbar with active indicators
│   │   │   ├── Hero.tsx                 # Hero section with role, badges & actions
│   │   │   ├── About.tsx                # Education, career interests & introduction
│   │   │   ├── Skills.tsx               # Categorized skills badges & cards
│   │   │   ├── Projects.tsx             # Dynamic projects fetched from backend REST API
│   │   │   ├── Certificates.tsx         # Dynamic certificates with preview modal
│   │   │   ├── Resume.tsx               # Professional resume summary & download
│   │   │   ├── Contact.tsx              # Validated contact form connected to MongoDB
│   │   │   └── Footer.tsx               # Social links, email, GitHub & copyright
│   │   ├── services/
│   │   │   └── api.ts                   # Centralized Axios API service layer
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript interfaces & types
│   │   ├── App.tsx                      # Root component orchestrating sections
│   │   ├── main.tsx                     # Entry point with Bootstrap & Router
│   │   ├── index.css                    # Modern blue/white responsive design system
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .env                             # Frontend environment configuration
│
├── server/                               # Backend Express + TypeScript REST API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts                    # MongoDB connection with status monitoring
│   │   │   ├── seed.ts                  # Database seeder
│   │   │   └── seedData.ts              # Default seed content for projects & profile
│   │   ├── controllers/
│   │   │   ├── profileController.ts     # Profile retrieve & update logic
│   │   │   ├── projectController.ts     # Project CRUD operations
│   │   │   ├── certificateController.ts # Certificate CRUD operations
│   │   │   └── contactController.ts     # Contact submissions & inquiry retrieval
│   │   ├── models/
│   │   │   ├── Profile.ts               # Mongoose Profile schema
│   │   │   ├── Project.ts               # Mongoose Project schema
│   │   │   ├── Certificate.ts           # Mongoose Certificate schema
│   │   │   └── Contact.ts               # Mongoose Contact inquiry schema
│   │   ├── routes/
│   │   │   ├── profileRoutes.ts         # /api/profile routes
│   │   │   ├── projectRoutes.ts         # /api/projects routes
│   │   │   ├── certificateRoutes.ts     # /api/certificates routes
│   │   │   └── contactRoutes.ts         # /api/contact routes
│   │   ├── swagger/
│   │   │   └── swaggerDocs.ts           # Complete OpenAPI 3.0 documentation
│   │   └── server.ts                    # Express entrypoint & middleware configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                             # Backend environment variables
│
├── package.json                         # Workspace scripts
└── README.md
```

---

## 🚀 Getting Started Step-by-Step

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)
- **MongoDB** (Local MongoDB Community Server running on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

### Step 1: Install Dependencies

#### Install Backend Dependencies:
```bash
cd server
npm install
```

#### Install Frontend Dependencies:
```bash
cd ../client
npm install
```

---

### Step 2: Configure Environment Variables

#### Backend `.env` (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/joyice_portfolio
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend `.env` (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

### Step 3: Run the Application

Open two terminal windows:

#### Terminal 1 — Start the Backend Server:
```bash
cd server
npm run dev
```
> The server will start on **`http://localhost:5000`**.  
> If MongoDB is running, it will automatically connect and seed initial data. If MongoDB is offline, it will serve fallback data and keep the API alive.

#### Terminal 2 — Start the Frontend Client:
```bash
cd client
npm run dev
```
> The React client will be available at **`http://localhost:3000`** (or `http://localhost:5173`).

---

## 📖 Swagger API Documentation

Interactive OpenAPI 3.0 documentation with live "Try it out" testing is available at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

### Available REST Endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check API & database connection status |
| `GET` | `/api/profile` | Retrieve Joyice's profile information |
| `PUT` | `/api/profile` | Update profile information |
| `GET` | `/api/projects` | List all projects (UsedMart, Disease Prediction, Story Gen) |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/:id` | Get project by ID |
| `PUT` | `/api/projects/:id` | Update project by ID |
| `DELETE`| `/api/projects/:id` | Delete project by ID |
| `GET` | `/api/certificates` | List all certifications |
| `POST` | `/api/certificates` | Add a new certificate |
| `GET` | `/api/certificates/:id` | Get certificate by ID |
| `PUT` | `/api/certificates/:id` | Update certificate by ID |
| `DELETE`| `/api/certificates/:id` | Delete certificate by ID |
| `POST` | `/api/contact` | Submit contact form message (saved to MongoDB) |
| `GET` | `/api/contact` | View all submitted inquiries |

---

## 🎨 UI Sections & Features

1. **Navbar**: Fixed Bootstrap navbar with smooth scrolling to sections and mobile toggler.
2. **Hero Section**:
   - Name: **Joyice Neelavathy**
   - Subtitle: **B.Tech Information Technology Student**
   - Direct buttons for "View Projects", "Download Resume", and "Swagger Docs".
   - Profile avatar with glowing ambient effect and floating tech badges.
3. **About Me**:
   - Educational background, career interests, and core strengths.
4. **Skills**:
   - Bootstrap cards and badges for HTML, CSS, JavaScript, TypeScript, React, Bootstrap, Node.js, Express.js, MongoDB, Java, Python, Git, and GitHub.
   - Filter pills by category (Frontend, Backend, Database, Languages, Tools).
5. **Projects**:
   - Dynamically loaded from `/api/projects`.
   - Includes *UsedMart*, *Disease Prediction*, and *Creative Story Generator*.
   - Tech badges, GitHub source button, Live Demo button, and detail modal.
6. **Certificates**:
   - Dynamically loaded from `/api/certificates`.
   - Cards with organization, date, and "View Certificate" preview modal.
7. **Resume**:
   - Downloadable PDF resume trigger and structured competency overview.
8. **Contact Form**:
   - Validates Name, Email, Subject, and Message.
   - Persists data to MongoDB via `POST /api/contact`.
   - Clean success/error alerts.
9. **Footer**:
   - Quick navigation links, social links (LinkedIn, GitHub, Email), and copyright.

---

## 🔨 Building for Production

### Build the Backend:
```bash
cd server
npm run build
npm start
```

### Build the Frontend:
```bash
cd client
npm run build
```
The compiled static assets will be located in `client/dist`.

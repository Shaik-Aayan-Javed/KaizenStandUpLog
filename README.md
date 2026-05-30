# Kaizen - Workspace & Standup Log 🚀

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg)](https://tailwindcss.com/)

Kaizen is a modern, high-performance workspace application designed to help teams stay aligned, communicate effectively, and track their sprint progress without the noise. Built on the MERN stack with a beautifully crafted React frontend and a robust Express/MongoDB backend, Kaizen replaces disjointed workflows with a unified, cohesive experience.

## ✨ Key Features

- **Dynamic Dashboard:** Track your sprint progress, daily schedules, and team consistency (streaks & participation) all at a glance.
- **Team Standups:** Log daily blockers, tasks, and updates. Includes real-time calendar tracking and sprint metric generation.
- **Unified Chat & Channels:** Slack-like team channels and DMs with real-time layouts, modern chat bubbles, emojis, and unread receipts.
- **Modular Architecture:** Frontend components and states are highly cohesive and loosely coupled utilizing React Contexts for independent feature domains (`AuthContext`, `MeetingsContext`, `ChatContext`, etc.).
- **Theme & Aesthetics:** Glassmorphism, tailored HSL color palettes, subtle micro-animations, and fluid responsive design powered by Tailwind CSS.
- **User Settings:** Fully integrated user profile management where users can set their avatars, roles, and emails with direct MongoDB syncing.

---

## 🛠️ Tech Stack

### Frontend
- **React (v19)** with Vite for ultra-fast development and building
- **Tailwind CSS (v4)** for modern, utility-first styling
- **FullCalendar** for interactive sprint and meeting tracking
- **Lucide React** for beautiful, consistent iconography

### Backend
- **Node.js** & **Express.js (v5)** for robust REST API routing
- **MongoDB** & **Mongoose (v9)** for flexible, document-based data storage
- **JWT & bcrypt** for secure user authentication and authorization
- **CORS & dotenv** for secure cross-origin requests and environment management

---

## 📂 Project Structure

The project is structured into two main independent directories for optimal separation of concerns:

```text
KaizenStandUpLog/
├── Backend/                    # Node.js + Express API server
│   ├── controllers/            # Request handlers (user, chat, groups, meetings, etc.)
│   ├── models/                 # Mongoose schemas (MongoDB)
│   ├── routes/                 # Express API routes
│   ├── server.js               # Entry point and server configuration
│   ├── seed.js                 # Database seeding utility
│   └── package.json            # Backend dependencies
│
├── Frontend/                   # React + Vite Client
│   ├── src/
│   │   ├── api/                # API service wrappers (fetch clients)
│   │   ├── components/         # Reusable UI components (Modals, Toast, Skeleton, etc.)
│   │   │   ├── dashboard/      # Dashboard-specific components (SprintPanel, Calendar)
│   │   │   └── ui/             # Generic atomic UI elements
│   │   ├── context/            # React Context providers (Auth, Chat, Meetings, Team)
│   │   ├── hooks/              # Custom React hooks (useToast, useCalendar)
│   │   ├── pages/              # Primary route views (Dashboard, History, Settings, Teams)
│   │   ├── App.jsx             # Main application shell and router
│   │   └── index.css           # Global styles and Tailwind configuration
│   ├── index.html              
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16+)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

### 1. Backend Setup
Open a terminal and navigate to the `Backend` directory:
```bash
cd Backend
npm install
```

Create a `.env` file inside the `Backend` directory and configure your environment variables:
```env
MONGO_URL=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/?appName=Cluster0
PORT=5001
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend development server:
```bash
npm run dev
```
*(The API will be available at http://localhost:5001)*

### 2. Frontend Setup
Open a new terminal and navigate to the `Frontend` directory:
```bash
cd Frontend
npm install
```

*(Optional)* Create a `.env` file in the `Frontend` directory if you need to override the default API URL:
```env
VITE_API_URL=http://localhost:5001
```

Start the Vite development server:
```bash
npm run dev
```
*(The React application will be available at http://localhost:5173)*

---

## 🌍 Deployment

Kaizen is 100% deployment-friendly and can easily be deployed on platforms like **Render**, **Vercel**, or **Heroku**. 

- **Frontend Deployment (Vercel/Render Static Site):**
  - Build command: `npm run build`
  - Publish directory: `dist`
  - *Ensure to set `VITE_API_URL` environment variable to your production backend URL.*
  
- **Backend Deployment (Render Web Service/Heroku):**
  - Build command: `npm install`
  - Start command: `node server.js`
  - *Ensure to set `MONGO_URL` and `JWT_SECRET` environment variables.*

*(Note: If deploying as two separate services, ensure your frontend environment variables point to your production backend API URL).*

---

## 🔮 Future Scope

While Kaizen is highly functional, there are several exciting avenues for future expansion:
1. **WebSocket Integration (Socket.io):** Transition the chat and standup updates from REST polling to fully real-time bidirectional WebSockets.
2. **Push Notifications:** Integrate browser-level push notifications to alert users when they are mentioned in a channel or when a new standup is posted.
3. **OAuth Authentication:** Allow users to log in using Google, GitHub, or Slack credentials for frictionless onboarding.
4. **Advanced Analytics & Reporting:** Create detailed PDF/CSV exports of sprint productivity, blocker resolutions, and team velocity over time.
5. **Single Service Deployment Refactoring:** Add express static routing to the backend to seamlessly serve the built Vite frontend from a single web service.

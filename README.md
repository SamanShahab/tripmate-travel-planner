# TripMate — Smart Travel Planner

A premium full-stack travel planning web application built with React, Node.js, Express, and MongoDB Atlas.

---

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS + Framer Motion + React Router  
**Backend:** Node.js + Express.js  
**Database:** MongoDB Atlas  
**APIs:** OpenWeatherMap  
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas (database)

---

## Project Structure

```
TripMate/
├── frontend/          # React + Vite app
└── backend/           # Node.js + Express API
```

---

## Local Setup

### 1. MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (for development)
5. Get your connection string:  
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tripmate`

### 2. OpenWeatherMap API Key
1. Go to [openweathermap.org](https://openweathermap.org/api)
2. Sign up and get a free API key
3. Use the **5 Day / 3 Hour Forecast** endpoint

### 3. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tripmate
JWT_SECRET=your_strong_secret_key
WEATHER_API_KEY=your_openweathermap_key
NODE_ENV=development
```

Seed destinations:
```bash
node seed.js
```

Start backend:
```bash
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_WEATHER_API_KEY=your_openweathermap_key
```

Start frontend:
```bash
npm run dev
```

Open: `http://localhost:5173`

---

## Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add Environment Variables:
   - `MONGO_URI` → your Atlas connection string
   - `JWT_SECRET` → strong secret
   - `WEATHER_API_KEY` → your key
   - `NODE_ENV` → `production`
   - `CLIENT_URL` → your Vercel frontend URL
6. Deploy

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Settings:
   - Root Directory: `frontend`
   - Framework: Vite
4. Add Environment Variables:
   - `VITE_API_URL` → `https://your-backend.onrender.com/api`
5. Deploy

### After Deployment — Seed Data

```bash
cd backend
node seed.js
```

---

## Features

- User authentication (JWT)
- Browse destinations (Pakistan + International)
- Search & filter by category
- Destination details with places & travel tips
- Multi-step trip creation
- Day-wise itinerary planner with activities
- Budget calculator with breakdown
- Real-time weather forecast
- Saved trips management
- User dashboard with trip overview
- Fully responsive design
- Premium dark editorial UI

---

## Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/destinations` | All Destinations |
| `/destinations/:id` | Destination Details |
| `/create-trip` | Create Trip (multi-step) |
| `/trips` | My Saved Trips |
| `/trips/:id/itinerary` | Itinerary Planner |
| `/trips/:id/budget` | Budget Calculator |
| `/trips/:id/weather` | Weather |
| `/dashboard` | User Dashboard |
| `/login` | Login |
| `/register` | Register |

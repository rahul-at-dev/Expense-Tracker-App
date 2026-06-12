# Pocket Expense - Expense Tracker Application

A full-stack expense tracking application built with modern web technologies.

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Axios for HTTP requests

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- CORS enabled

## Project Structure

```
Pocket-Expense/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── backend/           # Express.js server
│   ├── src/
│   │   ├── config/    # Database configuration
│   │   ├── models/    # MongoDB schemas
│   │   ├── routes/    # API endpoints
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints
- `GET /api/health` - Server health check

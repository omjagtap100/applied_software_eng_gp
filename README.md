# Applied Software Engineering — Group Project (SIT725)

This repository contains the team’s **VolunteerHub** application for the group project.

## Repository layout

| Path | Description |
|------|-------------|
| `volunteerhub/backend/` | Node.js + Express API, MongoDB (Mongoose), JWT auth |
| `volunteerhub/frontend/` | Static HTML/CSS/JS UI served by a small Express app 

## What the app does (current scope)

- **Authentication:** register, login (JWT), role-based access (Volunteer, OrganisationManager, Admin).
- **Organisations:** managers submit an organisation (Pending); admins approve or reject; managers can view their organisation and update details after approval.
- **UI:** auth pages and a post-login **dashboard** (`/dashboard`).

## Prerequisites

- **Node.js** 18+ recommended  
- **MongoDB** (Atlas or local) — set `MONGO_URI` in the backend `.env`

## Quick start

### 1. Backend

```bash
cd volunteerhub/backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set your own values (especially `MONGO_URI` and any secrets).

```bash
npm run seed 
npm start
```

Default URL: **http://localhost:5000** (or the `PORT` you set).  
Health check: `GET /health`

### 2. Frontend

```bash
cd volunteerhub/frontend
npm install
```

Optional: create `frontend/.env`:

```env
PORT=3300
API_BASE_URL=http://localhost:5000
```

```bash
npm start
```

Open **http://localhost:3300**  
- `/` — register / login  
- `/dashboard` — dashboard (requires login)



## API reference

Main API prefixes (on the backend host):

- `POST /auth/register`, `POST /auth/login`
- Organisation routes under `/auth/organizations`, `/auth/organizations/me`, `/auth/organizations/:id/review`, etc.

## Tech stack

- **Backend:** Express, Mongoose, bcrypt, jsonwebtoken, dotenv, CORS  
- **Frontend:** Vanilla JS, Express (static files + HTML routes)



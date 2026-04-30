# Deployment Guide (Render + GitHub Pages, No Supabase)

## 1) Render Setup

The backend runs from `if_I_were_project/backend` and uses PostgreSQL.

- Create a PostgreSQL database in Render.
- Create a Web Service from this repository (`render.yaml` is already configured).
- Add backend environment variables:
  - `DATABASE_URL` (from your Render Postgres instance)
  - `JWT_SECRET` (random long secret)
  - `FRONTEND_ORIGIN` (your GitHub Pages URL)

Backend health check:

- `GET https://<your-render-service>.onrender.com/healthz`

## 2) GitHub Pages Setup

Frontend deploy workflow:

- `.github/workflows/deploy-frontend.yml`

Add this GitHub Actions secret:

- `VITE_API_BASE_URL` (example: `https://<your-render-service>.onrender.com`)

Enable Pages:

- Repository -> Settings -> Pages
- Source: **GitHub Actions**

## 3) First Login Flow

This project keeps an `authorized_users` table:

- If `authorized_users` is empty, the first signup email is auto-authorized.
- After first login, you can manage access directly in DB if needed.

## 4) Local Development

Frontend (`if_I_were_project/`):

1. Create `.env`
2. Add `VITE_API_BASE_URL=http://localhost:8080`
3. Run `npm install`
4. Run `npm run dev`

Backend (`if_I_were_project/backend/`):

1. Copy `.env.example` to `.env`
2. Fill `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_ORIGIN`
3. Run `npm install`
4. Run `npm run dev`

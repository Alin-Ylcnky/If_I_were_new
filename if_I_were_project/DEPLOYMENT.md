# Deployment Guide (Render + GitHub Pages)

## 1) Render backend setup

This project now includes a Node backend at `backend/` to replace the Supabase Edge Function contact endpoint.

- Create a new Render Web Service from this repository.
- Render can auto-detect settings from `render.yaml`.
- Configure environment variables in Render:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `FRONTEND_ORIGIN` (your GitHub Pages URL)

Backend endpoint after deploy:

- `POST https://<your-render-service>.onrender.com/api/contact`
- `GET https://<your-render-service>.onrender.com/healthz`

## 2) GitHub frontend deploy setup

Frontend deploy is configured with GitHub Actions workflow:

- `.github/workflows/deploy-frontend.yml`

In your GitHub repository, add these **Actions secrets**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CONTACT_API_URL` (your Render endpoint, e.g. `https://<service>.onrender.com/api/contact`)

Then enable Pages:

- GitHub repository -> Settings -> Pages
- Source: **GitHub Actions**

When code is pushed to `main`, frontend deploys automatically.

## 3) Local development

Frontend:

1. Create `.env` in project root
2. Add:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
   - `VITE_CONTACT_API_URL=http://localhost:8080/api/contact` (optional)
3. Run `npm install` and `npm run dev`

Backend:

1. Go to `backend/`
2. Copy `.env.example` to `.env`
3. Fill env vars
4. Run `npm install` and `npm run dev`
# Deployment Guide (Render + GitHub Pages)

## 1) Render backend setup

This project now includes a Node backend at `backend/` to replace the Supabase Edge Function contact endpoint.

- Create a new Render Web Service from this repository.
- Render can auto-detect settings from `render.yaml`.
- Configure environment variables in Render:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `FRONTEND_ORIGIN` (your GitHub Pages URL)

Backend endpoint after deploy:

- `POST https://<your-render-service>.onrender.com/api/contact`
- `GET https://<your-render-service>.onrender.com/healthz`

## 2) GitHub frontend deploy setup

Frontend deploy is configured with GitHub Actions workflow:

- `.github/workflows/deploy-frontend.yml`

In your GitHub repository, add these **Actions secrets**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CONTACT_API_URL` (your Render endpoint, e.g. `https://<service>.onrender.com/api/contact`)

Then enable Pages:

- GitHub repository -> Settings -> Pages
- Source: **GitHub Actions**

When code is pushed to `main`, frontend deploys automatically.

## 3) Local development

Frontend:

1. Create `.env` in project root
2. Add:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`
   - `VITE_CONTACT_API_URL=http://localhost:8080/api/contact` (optional)
3. Run `npm install` and `npm run dev`

Backend:

1. Go to `backend/`
2. Copy `.env.example` to `.env`
3. Fill env vars
4. Run `npm install` and `npm run dev`

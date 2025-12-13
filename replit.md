# If I Were Project

## Overview
A React + TypeScript + Vite application with Supabase integration for backend services. This is a creative canvas/contribution tracking application with user authentication.

## Project Structure
- `if_I_were_project/` - Main application directory
  - `src/` - React source code
    - `components/` - Reusable UI components
    - `contexts/` - React context providers (Auth)
    - `lib/` - Utility libraries (Supabase client)
    - `pages/` - Page components (Home, Login, Signup, etc.)
  - `supabase/` - Supabase functions and migrations

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Backend**: Supabase (Auth, Database)
- **Icons**: Lucide React
- **Routing**: React Router v7

## Required Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development
- Dev server runs on port 5000
- Run: `cd if_I_were_project && npm run dev`

## Build
- `cd if_I_were_project && npm run build`
- Output directory: `if_I_were_project/dist`

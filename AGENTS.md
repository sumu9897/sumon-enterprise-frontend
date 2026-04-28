# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

React 18 + Vite frontend for M/S Sumon Enterprise, a construction company portfolio website. Deployed on Vercel.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

No test framework is configured.

## Architecture

### Routing Structure

Routes are defined in `src/App.jsx`:
- Public: `/`, `/about`, `/services`, `/projects`, `/projects/:slug`, `/gallery`, `/contact`
- Admin (protected): `/admin/login`, `/admin/dashboard`, `/admin/projects`, `/admin/projects/new`, `/admin/projects/edit/:id`, `/admin/inquiries`

### State Management

Two React Context providers wrap the app (in `src/App.jsx`):
- `AuthProvider` (`src/context/AuthContext.jsx`): Admin authentication, stores JWT in localStorage
- `ProjectProvider` (`src/context/ProjectContext.jsx`): Shared project state

Use hooks `useAuth()` and `useProjects()` to access context.

### API Layer

- `src/services/api.js`: Axios instance with base URL from `VITE_API_URL` env var
- Automatically attaches Bearer token from localStorage
- Redirects to `/admin/login` on 401 responses

### Dark Mode Pattern

Theme uses class-based toggling on `<html>`. Use the `useDarkMode()` hook (defined inline in page components like `Home.jsx`) to reactively read theme state.

### Data

Project data can come from:
1. Backend API via `src/services/api.js`
2. Static JSON at `src/data/projects.json` (fallback/reference)

When adding projects to JSON, images should be hosted on ImgBB with direct links (`https://i.ibb.co/...`).

## Key Conventions

- Tailwind config includes custom colors: `primary`, `secondary`, `success`, `warning`, `error` and fonts: `sans` (Roboto), `heading` (Poppins)
- Gold accent color is `#C9A84C` (used extensively in UI)
- Admin routes are protected by `PrivateRoute` component
- Toast notifications via react-toastify (configured in `App.jsx`)

## Environment Variables

```
VITE_API_URL=<backend API base URL>
VITE_APP_NAME=<app display name>
VITE_COMPANY_EMAIL=<contact email>
VITE_COMPANY_PHONE=<contact phone>
```

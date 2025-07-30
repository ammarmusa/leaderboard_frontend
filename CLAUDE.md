# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 frontend application for a Job Leaderboard system that tracks job assignments and contractor performance. The app features real-time updates via Server-Sent Events, interactive maps using Leaflet, and user authentication.

## Key Commands

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Core Structure
- **Next.js App Router** - Uses the app directory structure with layouts and pages
- **Authentication System** - Context-based auth with localStorage persistence and protected routes
- **Real-time Updates** - Server-Sent Events (SSE) for live job updates via `/api/events`
- **Map Integration** - Dynamic Leaflet maps with job location markers (client-side only)
- **Type Safety** - Full TypeScript with defined interfaces for Job, Contractor, and WebhookPayload

### Key Components
- `AuthContext` - Global authentication state management
- `ProtectedRoute` - Route wrapper requiring authentication
- `Map` - Dynamic import Leaflet component (SSR disabled)
- `Sidebar` - Job listings and contractor leaderboard
- `ErrorBoundary` - App-level error handling

### API Integration
- External API at `${NEXT_PUBLIC_API_URL}` (defaults to http://localhost:3001)
- Local proxy API routes in `/api/` for jobs, events, and webhooks
- Authentication endpoints: `/api/users/login` and `/api/users/register`

### State Management
- React Context for authentication
- Local state with hooks for job data
- Real-time updates through EventSource connection

### Styling
- **Tailwind CSS** - Utility-first styling with custom design system
- **Shadcn/ui** - Pre-built UI components (Button, Input, Form, etc.)
- **Custom theme** - Extended colors and design tokens in tailwind.config.ts
- **Responsive design** - Mobile-first approach with responsive sidebar

### Data Flow
1. Initial job data fetched from `/api/jobs` on page load
2. SSE connection established to `/api/events` for real-time updates  
3. Job updates handled via webhook payload format
4. Contractor leaderboard computed from job assignments

### Authentication Flow
- JWT tokens stored in localStorage
- AuthService handles login/register/logout operations
- Middleware.ts configured but currently client-side auth only
- ProtectedRoute wrapper guards authenticated pages
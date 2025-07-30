# Job Leaderboard - Authentication System

A modern, responsive authentication system built with Next.js, TypeScript, shadcn/ui, Framer Motion, and React Hook Form.

## Features

### 🔐 Authentication

- **User Registration**: Create new accounts with username, email, and password
- **User Login**: Secure login with email and password
- **Protected Routes**: Automatic redirection to login for unauthenticated users
- **Persistent Sessions**: Login state persisted across browser sessions
- **Logout Functionality**: Easy logout with session cleanup

### 🎨 UI/UX

- **Modern Design**: Built with shadcn/ui components
- **Smooth Animations**: Framer Motion animations for seamless transitions
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Loading States**: Beautiful loading indicators during API calls
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 🏗️ Architecture

- **MVC Pattern**: Clean separation of concerns
  - **Models**: Data validation and type definitions (`src/models/auth.ts`)
  - **Views**: React components (`src/components/auth/`)
  - **Controllers**: API services (`src/services/auth.ts`)
- **Context API**: Centralized authentication state management
- **Error Boundaries**: Graceful error handling and recovery

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (for authentication endpoints)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Update `NEXT_PUBLIC_API_URL` to point to your backend API.

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### Authentication Flow

1. **Visit the app**: Navigate to `http://localhost:3002`
2. **Automatic redirect**: Unauthenticated users are redirected to `/auth`
3. **Register/Login**: Create an account or login with existing credentials
4. **Access protected content**: Successfully authenticated users can access the main app

## API Integration

The system expects the following backend endpoints:

### Registration Endpoint

```
POST /api/users/register
Content-Type: application/json

{
  "username": "string (3-50 chars)",
  "email": "string (valid email)",
  "password": "string (6+ chars)"
}
```

### Login Endpoint

```
POST /api/users/login
Content-Type: application/json

{
  "email": "string (valid email)",
  "password": "string"
}
```

### Expected Response Format

```json
{
  "success": true,
  "message": "Success message",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  },
  "token": "string (JWT token)"
}
```

## Components Overview

### Core Components

- **`AuthPage`**: Main authentication container with login/register toggle
- **`LoginForm`**: Login form with validation and error handling
- **`RegisterForm`**: Registration form with validation
- **`ProtectedRoute`**: Higher-order component for route protection
- **`AuthProvider`**: Context provider for authentication state

### UI Components (shadcn/ui)

- **Button**: Customizable button component
- **Input**: Form input with validation states
- **Label**: Form labels with accessibility features
- **Form**: Form wrapper with validation integration
- **Card**: Container component for forms

## Validation

Form validation is handled using Zod schemas:

- **Username**: 3-50 characters, alphanumeric + underscores
- **Email**: Valid email format, max 100 characters
- **Password**: Minimum 6 characters, max 100 characters

## Error Handling

- **Form Validation**: Real-time validation with helpful error messages
- **API Errors**: Network and server errors handled gracefully
- **Error Boundaries**: App-wide error catching and recovery
- **Loading States**: Visual feedback during async operations

## Animations

Smooth animations powered by Framer Motion:

- **Page Transitions**: Fade and slide animations between login/register
- **Loading States**: Spin animations for loading indicators
- **Form Interactions**: Hover and focus animations
- **Error States**: Shake animations for validation errors

## Security Features

- **Client-side Validation**: Input validation before API calls
- **Token Storage**: Secure localStorage token management
- **Route Protection**: Automatic authentication checks
- **Session Persistence**: Remember login state across sessions

## Customization

### Styling

- Update CSS variables in `src/app/globals.css`
- Modify component themes in `tailwind.config.ts`
- Customize animations in individual components

### Validation Rules

- Update schemas in `src/models/auth.ts`
- Modify API calls in `src/services/auth.ts`

### Authentication Logic

- Extend `AuthContext` for additional features
- Add new routes to middleware configuration
- Customize redirect behavior in `ProtectedRoute`

## File Structure

```
src/
├── app/
│   ├── auth/
│   │   └── page.tsx          # Auth page route
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Protected home page
│   └── globals.css           # Global styles
├── components/
│   ├── auth/
│   │   ├── AuthPage.tsx      # Main auth container
│   │   ├── LoginForm.tsx     # Login form component
│   │   ├── RegisterForm.tsx  # Registration form
│   │   └── ProtectedRoute.tsx # Route protection HOC
│   ├── ui/                   # shadcn/ui components
│   └── ErrorBoundary.tsx     # Error handling
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── models/
│   └── auth.ts               # Data models and validation
├── services/
│   └── auth.ts               # API service calls
└── middleware.ts             # Route middleware
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

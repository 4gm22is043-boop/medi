# HealthAI Platform - Full Stack Healthcare Application

A production-ready, AI-powered healthcare platform with stunning UI/UX and real AI integration using Groq API.

## Project Structure

### Frontend (`/src`)

```
src/
├── components/              # Reusable UI components
│   ├── Layout.tsx          # Main layout with sidebar
│   ├── Sidebar.tsx         # Navigation sidebar with theme toggle
│   └── ProtectedRoute.tsx  # Route protection wrapper
│
├── contexts/               # React contexts for global state
│   ├── AuthContext.tsx    # Authentication state & functions
│   └── ThemeContext.tsx   # Dark/Light mode management
│
├── pages/                 # Main application pages
│   ├── Login.tsx         # Login page (glassmorphism design)
│   ├── Signup.tsx        # Signup page (glassmorphism design)
│   ├── Dashboard.tsx     # Health dashboard (clean medical design)
│   ├── DiseaseDetection.tsx  # AI disease detection (futuristic neon UI)
│   ├── RiskAssessment.tsx    # Health risk analysis (gradient theme)
│   ├── HealthMonitoring.tsx  # Vitals tracking (clinical layout)
│   └── Profile.tsx       # User profile management
│
├── services/             # API integration services
│   └── api.ts           # Health records, AI detection, risk assessment APIs
│
├── lib/                 # Utilities and configurations
│   └── supabase.ts     # Supabase client & type definitions
│
├── App.tsx             # Main app with routing
└── main.tsx           # Application entry point
```

### Backend (Supabase)

```
Database Tables:
├── user_profiles        # Extended user information
├── health_records       # Daily vitals and measurements
├── disease_assessments  # AI disease detection results
└── risk_assessments     # Comprehensive risk analysis

Edge Functions:
├── disease-detection/   # Groq AI for symptom analysis
└── risk-assessment/     # Groq AI for health risk scoring
```

## Features by Page

### 1. Authentication (Login/Signup)
- **Design**: Glassmorphism with animated backgrounds
- **Features**:
  - Email/Password authentication
  - JWT tokens (7-day expiry)
  - Profile creation on signup
  - Secure password hashing

### 2. Dashboard
- **Design**: Clean medical cards with soft shadows
- **Features**:
  - Latest vitals display (6 key metrics)
  - Heart rate trend chart (7-day)
  - Real-time health overview
  - Responsive grid layout

### 3. Disease Detection
- **Design**: Futuristic neon UI with dark gradient background
- **Features**:
  - Interactive symptom selector (20+ symptoms)
  - AI-powered disease prediction with confidence levels
  - Severity assessment (Low/Medium/High)
  - Recommendations from AI
  - History saved to database

### 4. Risk Assessment
- **Design**: Minimal gradient theme (blue to purple)
- **Features**:
  - Multi-step form (4 steps)
  - Demographics, medical history, lifestyle, vitals
  - AI-generated risk score (0-100)
  - Detailed analysis and recommendations
  - Health concerns highlighting

### 5. Health Monitoring
- **Design**: Clinical white layout with structured cards
- **Features**:
  - Add/Edit/Delete health records
  - Track 6 vital signs
  - Visual indicators with icons
  - Optional notes for each record
  - Chronological timeline view

### 6. Profile
- **Design**: Clean card-based layout
- **Features**:
  - Edit personal information
  - Blood type selection
  - Emergency contact
  - Demographic data

## Unique Design Elements

Each page has a DISTINCT visual identity:

1. **Auth Pages**: Glassmorphism, gradient backgrounds, blurred overlays
2. **Dashboard**: Light theme, medical cards, soft shadows, charts
3. **Disease Detection**: Dark theme, neon accents, futuristic glow effects
4. **Risk Assessment**: Blue-purple gradients, progress steps, elegant forms
5. **Health Monitoring**: Clinical white, structured data, icon-based vitals
6. **Profile**: Minimal cards, gradient avatars, clean forms

## Technology Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Recharts (data visualization)
- React Router (navigation)
- Lucide React (icons)

### Backend
- Supabase (database + authentication)
- PostgreSQL (data storage)
- Row Level Security (data protection)
- Edge Functions (serverless)
- Groq API (AI integration)

### AI Integration
- Groq LLaMA 3.1 70B model
- Disease detection from symptoms
- Health risk assessment
- Structured JSON responses

## Database Schema

### user_profiles
- Extended user information
- Blood type, allergies, chronic conditions
- Emergency contacts

### health_records
- Heart rate, blood pressure, temperature
- Oxygen level, glucose, weight
- Timestamps and notes

### disease_assessments
- Symptoms array
- AI-detected diseases (JSON)
- Recommendations and severity

### risk_assessments
- Medical history (JSON)
- Lifestyle data (JSON)
- Current vitals (JSON)
- Risk score and level
- AI analysis and recommendations

## Security Features

1. **Authentication**
   - JWT-based auth with Supabase
   - Secure password hashing
   - Protected routes

2. **Row Level Security (RLS)**
   - Users can only access their own data
   - All tables have RLS enabled
   - Policies for SELECT, INSERT, UPDATE, DELETE

3. **API Security**
   - Edge functions verify JWT tokens
   - CORS properly configured
   - Environment variables for secrets

## Dark/Light Mode

- Toggle in sidebar
- Persists in localStorage
- Tailwind dark: classes
- Smooth transitions

## Responsive Design

- Mobile-first approach
- Breakpoints: sm, md, lg
- Flexible grid layouts
- Sidebar adapts on mobile

## Animation Features

- Framer Motion for page transitions
- Hover effects on buttons/cards
- Loading states with spinners
- Smooth theme transitions
- Chart animations

## API Endpoints

### Health Records
- GET /api/health (list all)
- POST /api/health (create)
- PUT /api/health/:id (update)
- DELETE /api/health/:id (delete)

### AI Functions
- POST /functions/v1/disease-detection
- POST /functions/v1/risk-assessment

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Edge Functions need:
```
GROQ_API_KEY=your_groq_api_key
```

## File Organization

- Each page is self-contained
- Shared logic in contexts
- API calls in services
- Reusable components separate
- Type definitions in lib

## Best Practices Followed

1. Single Responsibility Principle
2. DRY (Don't Repeat Yourself)
3. Type safety with TypeScript
4. Error handling throughout
5. Loading states for async operations
6. Optimistic UI updates
7. Proper form validation
8. Accessible UI components
9. SEO-friendly structure
10. Clean code organization

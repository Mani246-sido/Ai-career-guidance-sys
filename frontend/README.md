# Vector — Frontend

Premium, light-themed frontend for the Vector AI career platform. Built with React + Vite, Tailwind v4, Framer Motion, React Three Fiber, Zustand, and Recharts.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend, e.g. http://localhost:5000/api
npm run dev
```

## Structure

```
src/
  components/
    ui/          GlassCard, GradientButton, MetricCard, ProgressRing, AnimatedCounter, AuroraBackground
    layout/      Navbar, Footer, Sidebar, ProtectedRoute
    sections/    Landing page sections (Hero, Features, HowItWorks, TimeMachinePreview, Testimonials, FAQ, CTA)
    three/       CareerPathScene — signature 3D career-path visual (react-three-fiber)
  layouts/       DashboardLayout
  pages/         Landing, Login, Signup, Dashboard, NotFound
  pages/dashboard/  TimeMachine, Internship, Resume, Interview, Roadmap, Profile
  services/      api.js (axios + refresh interceptor), auth.service.js (all backend endpoints)
  store/         authStore.js (Zustand)
  hooks/         useLenis.js (smooth scroll)
```

## Design tokens

Defined in `src/index.css` under `@theme`. Light palette: canvas `#FAFBFC`, ink `#0F1424`, indigo `#5B5FEF`, gold `#E8B94E`, mint `#12B5A6`, sky `#A5D8FF`. Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (data).

## Backend

Points at the Vector Express backend routes (`/auth`, `/profile`, `/dashboard`, `/career`, `/internship`, `/resume`, `/interview`, `/roadmap`, `/notifications`, `/skills`, `/admin`). Update `VITE_API_URL` in `.env` to match your server.

## Notes

- Dashboard sub-pages (Internship, Resume, Interview, Roadmap, Profile) currently render with sample data — wire them to `services/auth.service.js` calls as the backend is connected.
- `ProtectedRoute` checks for a stored access token; swap in real session validation once auth is live.

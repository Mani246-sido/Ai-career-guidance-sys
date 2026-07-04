# Vector 

 the Vector AI career platform. Built with React + Vite, Tailwind v4, Framer Motion, React Three Fiber, Zustand, and Recharts.

## Setup

```bash
npm install
create you own .env and enter your entry pont
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





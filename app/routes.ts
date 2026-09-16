import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('welcome', 'routes/welcome.tsx'),
  route('about', 'routes/about.tsx'),
  route('reports', 'routes/reports.tsx'),
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  route('api/audit', 'routes/api.audit.ts'),
] satisfies RouteConfig

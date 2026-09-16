import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { Route } from './+types/root'
import './app.css'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'OTISEC SENTINEL — Smart Contract Auditor' },
    {
      name: 'description',
      content:
        'Multi-phase smart contract security auditor by Thragg-oti. Business logic vulnerability detection with probability models, Aave V3 checklist, and SmartBugs vulnerability matrix.',
    },
    { name: 'keywords', content: 'smart contract audit, solidity security, DeFi security, Aave V3, vulnerability scanner, Thragg-oti' },
    { property: 'og:title', content: 'OTISEC SENTINEL' },
    { property: 'og:description', content: 'Elite smart contract security auditor — Thragg-oti' },
    { property: 'og:type', content: 'website' },
  ]
}

export function links() {
  return [
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
    { rel: 'apple-touch-icon', href: '/app-icon-512.png' },
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

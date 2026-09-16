import type { Route } from './+types/reports'
import { requireAuth } from '@/lib/session.server'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'
import { PastReportsList } from '@/components/PastReportsList'

export async function loader({ request }: Route.LoaderArgs) {
  await requireAuth(request)
  return null
}

export default function Reports() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', color: 'var(--text-body)' }}>
      <SiteNav />
      <main style={{ flex: 1, maxWidth: 840, margin: '0 auto', padding: '40px 20px', width: '100%' }}>
        <PastReportsList />
      </main>
      <SiteFooter />
    </div>
  )
}

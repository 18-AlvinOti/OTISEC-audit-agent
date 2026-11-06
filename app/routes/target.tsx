import type { Route } from './+types/target'
import { TargetProfile, SAMPLE_RECORD, SAMPLE_TARGETS } from '@/components/target-profile'
import { SiteNav } from '@/components/SiteNav'
import { SiteFooter } from '@/components/SiteFooter'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Target Profile — OTISEC SENTINEL' },
    {
      name: 'description',
      content:
        'Football Manager–style target profile and Bayesian risk matrix for audited smart contracts in OTISEC SENTINEL.',
    },
    { property: 'og:title', content: 'Target Profile — OTISEC SENTINEL' },
    {
      property: 'og:description',
      content:
        'Football Manager–style target profile and Bayesian risk matrix for audited smart contracts in OTISEC SENTINEL.',
    },
  ]
}

export default function TargetRoute() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <SiteNav />
      <main style={{ flex: 1 }}>
        <TargetProfile
          targets={SAMPLE_TARGETS}
          record={SAMPLE_RECORD}
          footerNote="Sample data · drop a codebase to populate"
        />
      </main>
      <SiteFooter />
    </div>
  )
}

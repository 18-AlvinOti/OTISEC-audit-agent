import { Form, redirect, useActionData, useSearchParams } from 'react-router'
import { createHash, timingSafeEqual } from 'node:crypto'
import type { Route } from './+types/login'
import { createAuthSession, isAuthenticated } from '@/lib/session.server'
import { Icon } from '@/components/Icon'
import { BrandMark } from '@/components/BrandMark'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'

function safeCompare(a: string, b: string) {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export async function loader({ request }: Route.LoaderArgs) {
  if (await isAuthenticated(request)) {
    return redirect('/')
  }
  return null
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()
  const code = String(formData.get('code') || '')
  const redirectTo = String(formData.get('redirectTo') || '/')

  const accessCode = process.env.ACCESS_CODE
  if (!accessCode) {
    return { error: 'Server misconfigured: ACCESS_CODE not set' }
  }

  if (!code || !safeCompare(code, accessCode)) {
    return { error: 'Invalid access code' }
  }

  const cookie = await createAuthSession(request)
  return redirect(redirectTo.startsWith('/') ? redirectTo : '/', {
    headers: { 'Set-Cookie': cookie },
  })
}

export default function Login() {
  const actionData = useActionData<typeof action>()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-app)', position: 'relative', overflow: 'hidden',
    }}>
      {/* Brand watermark — reserved for this gate screen only, not product chrome */}
      <img
        src="/otisec-mark.png" alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', right: '-8%', top: '50%', transform: 'translateY(-50%)',
          width: 560, maxWidth: '70vw', opacity: 0.08,
          pointerEvents: 'none', userSelect: 'none',
        }}
      />

      <div style={{
        width: '100%', maxWidth: 384, padding: 24, borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-2)', background: 'var(--surface-card)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-md)', background: 'var(--teal-900)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: '1px solid var(--border-teal-strong)',
          }}>
            <BrandMark size={16} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-widest)', color: 'var(--text-teal-heading)' }}>
              OTISEC SENTINEL
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-micro)', color: 'var(--text-teal-sub)' }}>
              Access restricted
            </div>
          </div>
        </div>

        <Form method="post" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <label>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-tiny)', color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: 6,
            }}>Access Code</div>
            <Input type="password" name="code" autoFocus required icon={<Icon name="lock" size={14} />} />
          </label>
          {actionData?.error && (
            <div style={{
              fontSize: 'var(--text-xs)', color: '#fca5a5', background: 'rgba(127,29,29,0.2)',
              border: '1px solid rgba(153,27,27,0.5)', borderRadius: 'var(--radius-md)', padding: '8px 12px',
            }}>
              {actionData.error}
            </div>
          )}
          <Button type="submit" fullWidth style={{ padding: '10px 16px' }}>
            Unlock
          </Button>
        </Form>
      </div>
    </div>
  )
}

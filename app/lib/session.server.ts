import { createCookieSessionStorage, redirect } from 'react-router'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__otisec_session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
})

export async function getSession(request: Request) {
  return sessionStorage.getSession(request.headers.get('Cookie'))
}

export async function isAuthenticated(request: Request) {
  const session = await getSession(request)
  return session.get('authed') === true
}

export async function requireAuth(request: Request) {
  if (!(await isAuthenticated(request))) {
    const url = new URL(request.url)
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`)
  }
}

export async function requireAuthApi(request: Request) {
  if (!(await isAuthenticated(request))) {
    throw Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export async function createAuthSession(request: Request) {
  const session = await getSession(request)
  session.set('authed', true)
  return sessionStorage.commitSession(session)
}

export async function destroySession(request: Request) {
  const session = await getSession(request)
  return sessionStorage.destroySession(session)
}

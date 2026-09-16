import { redirect } from 'react-router'
import type { Route } from './+types/logout'
import { destroySession } from '@/lib/session.server'

export async function action({ request }: Route.ActionArgs) {
  const cookie = await destroySession(request)
  return redirect('/login', { headers: { 'Set-Cookie': cookie } })
}

export async function loader() {
  return redirect('/')
}

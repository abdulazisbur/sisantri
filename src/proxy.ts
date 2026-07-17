import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const publicPaths = ['/', '/api/auth/login', '/api/auth/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next()
  }

  // Allow static files and _next
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('auth-token')
    return response
  }

  // Role-based access control
  if (pathname.startsWith('/dashboard')) {
    // All authenticated users can access dashboard
    return NextResponse.next()
  }

  if (pathname.startsWith('/struktur') || pathname.startsWith('/divisi')) {
    // Only admin can manage
    if (payload.role !== 'ADMIN' && request.method !== 'GET') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

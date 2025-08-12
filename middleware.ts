import { NextRequest, NextResponse } from 'next/server'

const isPublicPath = (pathname: string) => {
  if (pathname === '/login') return true
  if (pathname.startsWith('/_next')) return true
  if (pathname === '/favicon.ico') return true
  if (pathname.startsWith('/public')) return true
  if (pathname.startsWith('/api')) return true
  return false
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Let client-side handle auth checks, only handle public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // For all other paths, let the client-side AuthLogger handle redirects
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

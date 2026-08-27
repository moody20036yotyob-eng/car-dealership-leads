import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'
  const hasSession = request.cookies.has('admin-session')

  if (isAdminRoute && !isLoginRoute && !hasSession) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginRoute && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

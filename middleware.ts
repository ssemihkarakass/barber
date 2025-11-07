import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Sadece protected route'lar için çalıştır
  const protectedPaths = ['/dashboard', '/admin', '/employee']
  const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
  
  if (isProtected) {
    return await updateSession(request)
  }
  
  // Diğer sayfalar için middleware'i atla (hız için)
  return
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/employee/:path*',
  ],
}

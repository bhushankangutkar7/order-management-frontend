// This is a middleware function
import 'server-only';
import { NextResponse } from 'next/server';
import { verifyCookie } from './utils/server/VerifyCookie';

const protectedRoutes = ['/dashboard', '/orders', '/cart', '/profile']; 
const authRoutes = ['/login', '/signup'];

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  try {
    const verified = verifyCookie();

    // Scenario A: User is NOT logged in and trying to access a protected page
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    if (isProtected && !verified) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  
    // Scenario B: User IS logged in but trying to access /login or /signup
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    if (isAuthRoute && verified) {
      return NextResponse.redirect(new URL('/menu', request.url));
    }
  
    return NextResponse.next();

  } catch(error) {
    console.error('Proxy error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
  

}

// Optimize middleware by only running it on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
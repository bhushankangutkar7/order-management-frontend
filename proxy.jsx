// src/proxy.js
import { NextResponse } from 'next/server';
import { verifyJwtToken } from './utils/server/JwtHelper';

const protectedRoutes = [
  '/menu',
  '/orders',
  '/cart',
  '/profile',
];

const authRoutes = [
  '/login',
  '/signup',
];

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get('session_token')?.value;

  let user = null;

  if (token) {
    try {
      user = await verifyJwtToken(token);
    } catch {
      user = null;
    }
  }

  const isProtected = protectedRoutes.some(
    (route) => pathname.startsWith(route)
  );

  if (isProtected && !user) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  const isAuthRoute = authRoutes.some(
    (route) => pathname.startsWith(route)
  );

  if (isAuthRoute && user) {
    return NextResponse.redirect(
      new URL('/menu', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
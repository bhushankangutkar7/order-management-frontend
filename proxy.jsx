// src/proxy.js
import { NextResponse } from 'next/server';
import axios from 'axios';

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
      user = await axios.get(
        `${process.env.BACKEND_NODE_URL}/api/v1/auth/verify-token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );  
    } catch (err) {
      console.error("JWT error:", err.message);
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
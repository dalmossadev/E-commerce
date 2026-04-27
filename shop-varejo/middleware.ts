import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/checkout', '/orders', '/dashboard', '/admin'];
const publicRoutes = ['/', '/produtos', '/login', '/register', '/api/auth'];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => {
    if (route.endsWith('/*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => {
    if (route.endsWith('/*')) {
      return pathname.startsWith(route.slice(0, -1));
    }
    return pathname === route || pathname.startsWith(`${route}/`);
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookie = request.headers.get('cookie');
  const sessionToken = cookie?.match(/__session=([^;]+)/)?.[1];

  const isAuthenticated = !!sessionToken;
  const isAuthApi = pathname.startsWith('/api/auth');

  if (isAuthApi) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    if (isAuthenticated) {
      if (pathname === '/login' || pathname === '/register') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    return NextResponse.next();
  }

  if (isProtectedRoute(pathname)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
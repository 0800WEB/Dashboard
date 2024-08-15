// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // O el método que utilices para verificar el token
  const { pathname } = request.nextUrl;

  if (pathname === '/signin' && token) {
    // Si el usuario está autenticado, no permitir acceso a /signin
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && pathname !== '/signin') {
    // Si el usuario no está autenticado, redirigir a /signin
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

// Configuración del middleware para que aplique a todas las rutas
export const config = {
  matcher: ['/', '/dashboard/:path*', '/orders/:path*', '/products/:path*', '/customers/:path*'],
};

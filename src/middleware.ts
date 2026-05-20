import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    // Only protect /admin routes
    if (!request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Exclude /admin/login from protection
    if (request.nextUrl.pathname === '/admin/login') {
        return NextResponse.next();
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const verified = await verifyToken(token);

    if (!verified) {
        // Token is invalid/expired
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};

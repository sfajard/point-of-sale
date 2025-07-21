import { NextResponse, NextRequest } from "next/server";
import { auth } from '@/auth'

const protectedRoutes = ['/dashboard', '/checkout']

/**
 * Middleware that controls access to protected routes based on user authentication and role.
 *
 * Redirects unauthenticated users attempting to access protected routes to the sign-in page. Redirects authenticated non-admin users away from admin-only routes, and prevents logged-in users from accessing the sign-in page.
 *
 * @returns A redirect response if access is denied; otherwise, allows the request to proceed.
 */
export async function middleware(req: NextRequest) {
    const session = await auth()
    const isLoggedIn = !!session?.user
    const role = session?.user.role
    const {pathname} = req.nextUrl

    if (!isLoggedIn && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    if (isLoggedIn && role !== 'admin' && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    if (isLoggedIn && pathname.startsWith('/signin')) {
        return NextResponse.redirect(new URL('/', req.url))
    }
}


export const config = {
    mather: ["/((?!api|_next/static|_next/image|favicon.ico).*"] 
}
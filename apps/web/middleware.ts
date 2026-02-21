import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// --- Minimal JWT Decoder (for edge runtime compatibility) ---
function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read role from httpOnly cookie set by backend at login/refresh.
  const roleCookie = request.cookies.get("role")?.value || null;

  // Read access token from cookie (if stored)
  const accessToken = request.cookies.get("access_token")?.value || null;

  // Public paths that don't require authentication
  const publicPaths = [
    "/auth/login",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/reset-required",
    "/unauthorized",
  ];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If accessing auth pages and already logged in, redirect to appropriate dashboard
  if (pathname.startsWith("/auth") && !isPublicPath && accessToken) {
    if (roleCookie === "admin" || roleCookie === "super_admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (roleCookie === "instructor") {
      return NextResponse.redirect(
        new URL("/instructor/dashboard", request.url),
      );
    }
    if (roleCookie === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  // Protect role-based app paths
  if (pathname.startsWith("/admin")) {
    if (
      !roleCookie ||
      (roleCookie !== "admin" && roleCookie !== "super_admin")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/instructor")) {
    if (!roleCookie || roleCookie !== "instructor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  if (pathname.startsWith("/student")) {
    if (!roleCookie || roleCookie !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Run middleware for role paths and auth paths
export const config = {
  matcher: [
    "/admin/:path*",
    "/instructor/:path*",
    "/student/:path*",
    "/auth/:path*",
  ],
};

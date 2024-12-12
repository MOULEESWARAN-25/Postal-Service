import { NextResponse } from "next/server";

export function middleware(request) {
  // Protected routes
  const protectedRoutes = ["/", "/dashboard", "/test"];

  // Log more detailed information about the request
  console.log("Request URL:", request.url);
  console.log("Request Pathname:", request.nextUrl.pathname);
  console.log("Cookies:", request.cookies);

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route)
  );

  // If it's not a protected route, allow access
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for token in cookies
  const token = request.cookies.get("token")?.value;

  console.log("Token found:", !!token);

  // If no token is found, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Optional: Add basic token validation
  try {
    // Basic token validation
    if (!isValidToken(token)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token validation error:", error);
    // If any error occurs during token validation, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Placeholder function for token validation
function isValidToken(token) {
  // Basic validation - replace with your actual token validation logic
  return token && token.length > 10;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    // Protect dashboard, test, and home routes
    "/",
    "/dashboard/:path*",
    "/test/:path*",
  ],
};

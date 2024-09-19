import { NextRequest, NextResponse } from "next/server";
import { passage } from "./app/lib/passage";

export async function middleware(request: NextRequest) {
  const { cookies } = request;
  const token = cookies.get("psg_auth_token");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const userID = await passage.authenticateRequest(request);

    if (userID) {
      // User is authenticated, proceed to the requested page
      return NextResponse.next();
    }
  } catch (error) {
    // Token is invalid or expired, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};

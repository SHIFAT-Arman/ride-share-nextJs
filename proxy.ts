import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  if (!req.cookies.get("access_token")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path"] }; //Run this middleware only for requests matching this pattern.

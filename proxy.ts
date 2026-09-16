import { NextRequest, NextResponse } from "next/server";

/** Session exists if either access or refresh cookie is present (access may be expired). */
export function proxy(req: NextRequest) {
  if (!req.cookies.get("rs_access") && !req.cookies.get("rs_refresh")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/portal/:path*"] };

import { NextRequest, NextResponse } from "next/server";

export function redirectMiddleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isRegisterPage = request.nextUrl.pathname === "/register";
  const isHomePage = request.nextUrl.pathname === "/";

  if (user && (isHomePage || isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/user/house/list", request.url));
  }

  if (!user && isHomePage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

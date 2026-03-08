import { RoleName } from "@/common/enum/role.enum";
import { UserOutputDTO } from "@/http/DTO/UserOutputDTO";
import { NextRequest, NextResponse } from "next/server";

export function redirectMiddleware(request: NextRequest) {
  const user = request.cookies.get("user")?.value;

  const isLoginPage = request.nextUrl.pathname === "/login";
  const isRegisterPage = request.nextUrl.pathname === "/register";
  const isHomePage = request.nextUrl.pathname === "/";
  const isAdminPage = request.nextUrl.pathname === "/admin";

  if (user) {
    const isAdmin = (JSON.parse(user) as UserOutputDTO).userRoles?.some(ur => ur.role.name === RoleName.ADMIN);
    if (!isAdmin && isAdminPage) {
      return NextResponse.redirect(new URL("/user/house/list", request.url));
    }  
  }

  if (user && (isHomePage || isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL("/user/house/list", request.url));
  }

  if (!user && isHomePage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

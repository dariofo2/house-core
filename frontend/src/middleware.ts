import { NextRequest, NextResponse } from "next/server";
import { redirectMiddleware } from "./middleware/redirect.middleware";

export function middleware(request: NextRequest) {
  const resp = redirectMiddleware(request);
  if (resp) return resp;

  return NextResponse.next();
}

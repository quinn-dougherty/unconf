import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasAccess = request.cookies.get("unconf_access")?.value === "1";
  const isGatePage = request.nextUrl.pathname === "/gate";

  if (!hasAccess && !isGatePage) {
    return NextResponse.redirect(new URL("/gate", request.url));
  }

  if (hasAccess && isGatePage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

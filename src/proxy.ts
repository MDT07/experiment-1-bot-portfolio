import { NextRequest, NextResponse } from "next/server";

function equalConstantTime(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function credentials(request: NextRequest): { username: string; password: string } | null {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return null;

  try {
    const decoded = atob(authorization.slice(6));
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return { username: decoded.slice(0, separator), password: decoded.slice(separator + 1) };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new NextResponse("Not found", {
      status: 404,
      headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" },
    });
  }

  const supplied = credentials(request);
  const authorized =
    supplied &&
    equalConstantTime(supplied.username, expectedUsername) &&
    equalConstantTime(supplied.password, expectedPassword);

  if (!authorized) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Owner operations", charset="UTF-8"',
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export const config = {
  matcher: ["/ops/:path*", "/api/ops/:path*"],
};

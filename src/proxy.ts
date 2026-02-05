import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { ratelimit } from "@/lib/ratelimit";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // Rate Limiting Logic (DDoS Protection)
  const ip = request.headers.get('x-forwarded-for') ?? "127.0.0.1";

  // Skip rate limiting for some routes if needed, but usually apply to all API/Protected routes
  if (request.nextUrl.pathname.startsWith('/api') || isProtectedRoute(request)) {
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        });
      }
      return new NextResponse("Too many requests. Please try again later.", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      });
    }
  }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

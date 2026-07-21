// middleware.ts (root)
// NOTE: Using the deprecated middleware.ts convention instead of proxy.ts
// because @opennextjs/cloudflare does not yet support Node.js middleware
// (proxy.ts always runs on Node.js in Next.js 16). Edge runtime is required
// for Cloudflare deployment. Switch back to proxy.ts once OpenNext adds
// Node.js middleware support: https://github.com/opennextjs/opennextjs-cloudflare/issues/962
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export const runtime = "experimental-edge";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

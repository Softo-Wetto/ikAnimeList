import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const protectedPrefixes = ["/dashboard", "/library", "/recommendations", "/settings"];
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const development = process.env.NODE_ENV === "development";
  // Styles must use 'unsafe-inline' WITHOUT a nonce: a nonce on style-src makes browsers ignore
  // 'unsafe-inline', which strips the inline styles Next.js <Image fill> and dynamic components
  // (e.g. the score ring) rely on, collapsing their layout. Scripts keep the nonce + strict-dynamic.
  const contentSecurityPolicy = `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ""}; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://cdn.myanimelist.net https://images.myanimelist.net https://media.kitsu.app https://media.kitsu.io https://img.youtube.com https://i.ytimg.com; font-src 'self'; connect-src 'self' https://api.jikan.moe https://kitsu.app https://kitsu.io; frame-src https://www.youtube.com https://www.youtube-nocookie.com; media-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`.replace(/\s{2,}/g, " ").trim();
  if (protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix)) && !getSessionCookie(request)) {
    const signIn = new URL("/sign-in", request.url); signIn.searchParams.set("callbackURL", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    const redirect = NextResponse.redirect(signIn); redirect.headers.set("Content-Security-Policy", contentSecurityPolicy); return redirect;
  }
  const requestHeaders = new Headers(request.headers); requestHeaders.set("x-nonce", nonce); requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  const response = NextResponse.next({ request: { headers: requestHeaders } }); response.headers.set("Content-Security-Policy", contentSecurityPolicy); return response;
}
export const config = { matcher: [{ source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)", missing: [{ type: "header", key: "next-router-prefetch" }, { type: "header", key: "purpose", value: "prefetch" }] }] };

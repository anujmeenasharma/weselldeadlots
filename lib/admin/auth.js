// Server-only admin auth helpers. Never import from client components.
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  getSessionSecret,
  hmac,
  safeEqual,
  verifySessionToken,
} from "./session";

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && getSessionSecret() && process.env.SANITY_API_WRITE_TOKEN);
}

export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token, getSessionSecret());
}

/** Use at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** For server actions / route handlers that must return an error instead of redirecting. */
export async function assertAdmin() {
  if (!(await isAdmin())) throw new Error("Your session has expired. Please sign in again.");
}

// Best-effort brute-force protection (per server instance).
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "local";
}

export async function signIn(password) {
  const secret = getSessionSecret();
  const expected = process.env.ADMIN_PASSWORD;
  if (!secret || !expected) return { error: "The admin panel isn't set up yet (missing ADMIN_PASSWORD / ADMIN_SESSION_SECRET)." };

  const ip = await clientIp();
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.reset > now && record.count >= MAX_ATTEMPTS) {
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }

  // Compare HMACs so the comparison is constant-time regardless of password length.
  const ok = safeEqual(await hmac(secret, String(password || "")), await hmac(secret, expected));
  if (!ok) {
    const fresh = !record || record.reset <= now;
    attempts.set(ip, { count: fresh ? 1 : record.count + 1, reset: fresh ? now + WINDOW_MS : record.reset });
    return { error: "That password isn't right." };
  }

  attempts.delete(ip);
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return { ok: true };
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
}

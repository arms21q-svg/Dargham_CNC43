import { cookies } from "next/headers";

export const ADMIN_COOKIE = "dirgham_admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "dirgham2025";
}

function expectedToken() {
  return btoa(`dirgham:${getAdminPassword()}`);
}

export function createAdminToken(password: string): string | null {
  if (password !== getAdminPassword()) return null;
  return expectedToken();
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === expectedToken();
}

export async function setAdminSession(password: string): Promise<boolean> {
  const token = createAdminToken(password);
  if (!token) return false;
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return true;
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return verifyAdminToken(jar.get(ADMIN_COOKIE)?.value);
}

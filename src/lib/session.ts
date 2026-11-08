import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const COOKIE_NAME = 'advstat_session';
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters.');
  return new TextEncoder().encode(value);
}
export async function createSession(user: { id: string; name: string; email: string }) {
  const token = await new SignJWT({ name: user.name, email: user.email })
    .setProtectedHeader({ alg: 'HS256' }).setSubject(user.id).setIssuedAt().setExpirationTime('7d').sign(secret());
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession() {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    return { id: payload.sub, name: String(payload.name ?? ''), email: String(payload.email ?? '') };
  } catch { return null; }
}
export async function destroySession() {
  (await cookies()).delete(COOKIE_NAME);
}

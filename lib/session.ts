import { EncryptJWT, jwtDecrypt } from "jose";
import { cookies } from "next/headers";
import { COOKIE_NAME, getEncryptionKey } from "./sessionKey";
import type { SessionData } from "./usv/types";

const SESSION_DURATION = 60 * 60 * 8; // 8 ore

// The session carries the user's live USV (PeopleSoft) cookies, so the token
// must be ENCRYPTED, not merely signed — a signed JWT exposes its payload as
// plaintext base64. We use JWE (dir + A256GCM); see lib/sessionKey.ts for key
// derivation.
export async function createSession(data: SessionData): Promise<string> {
  const token = await new EncryptJWT({ ...data })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setIssuedAt()
    .encrypt(await getEncryptionKey());
  return token;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtDecrypt(token, await getEncryptionKey());
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  });
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };

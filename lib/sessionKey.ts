// Runtime-agnostic session-cookie name + encryption key derivation.
// Kept free of `next/headers` and node:crypto so it can be imported from both
// the Edge middleware and Node server routes.

export const COOKIE_NAME = "usv_session";

// JWE `dir` + A256GCM needs a 32-byte key. Derive it from AUTH_SECRET via
// SHA-256 (WebCrypto — available on both Edge and Node) so any secret length
// works and the result is identical across runtimes.
export async function getEncryptionKey(): Promise<Uint8Array> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET env var missing");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return new Uint8Array(digest);
}

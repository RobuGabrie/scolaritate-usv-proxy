import { NextRequest, NextResponse } from "next/server";
import { loginToUSV } from "@/lib/usv/auth";
import { createSession, setSessionCookie } from "@/lib/session";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`login:${ip}`, LIMITS.login)) {
    console.log(JSON.stringify({ level: "warn", msg: "/api/auth/login 429 rate limit hit", ip }));
    return NextResponse.json(
      { error: "Prea multe încercări. Încearcă din nou peste 15 minute." },
      { status: 429, headers: { "Retry-After": "900" } }
    );
  }

  const { userid, pwd } = await req.json();

  if (!userid || !pwd) {
    return NextResponse.json({ error: "Completează toate câmpurile." }, { status: 400 });
  }

  let result;
  try {
    result = await loginToUSV(userid.trim(), pwd);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Eroare rețea";
    console.log(JSON.stringify({ level: "error", msg: "/api/auth/login network error", ip, error: msg }));
    return NextResponse.json(
      { error: `Conexiune la USV eșuată: ${msg}. Verifică că ești pe rețeaua USV (VPN sau campus).` },
      { status: 503 }
    );
  }

  if (!result.ok) {
    console.log(JSON.stringify({ level: "warn", msg: "/api/auth/login failed", ip }));
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  console.log(JSON.stringify({ level: "info", msg: "/api/auth/login success", ip }));
  const token = await createSession({
    cookies: result.cookies,
    userId: result.userId,
    displayName: result.displayName,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  });

  await setSessionCookie(token);

  return NextResponse.json({ ok: true, displayName: result.displayName });
}

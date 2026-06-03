import { NextRequest, NextResponse } from "next/server";
import { loginToUSV } from "@/lib/usv/auth";
import { createSession, setSessionCookie } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { userid, pwd } = await req.json();

  if (!userid || !pwd) {
    return NextResponse.json({ error: "Completează toate câmpurile." }, { status: 400 });
  }

  let result;
  try {
    result = await loginToUSV(userid.trim(), pwd);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Eroare rețea";
    return NextResponse.json(
      { error: `Conexiune la USV eșuată: ${msg}. Verifică că ești pe rețeaua USV (VPN sau campus).` },
      { status: 503 }
    );
  }

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const token = await createSession({
    cookies: result.cookies,
    userId: result.userId,
    displayName: result.displayName,
    expiresAt: Date.now() + 8 * 60 * 60 * 1000,
  });

  await setSessionCookie(token);

  return NextResponse.json({ ok: true, displayName: result.displayName });
}

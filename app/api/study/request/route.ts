import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/ratelimit";
import { isValidSlug } from "@/lib/study/content";

const REQUEST_TYPES = {
  "materie-noua": "Materie nouă",
  "corectura": "Corectură conținut",
  "drept-editare": "Drept de editare",
} as const;

type RequestType = keyof typeof REQUEST_TYPES;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Middleware skips /api/* — gate here. Session is ONLY a gate: nothing from
  // it goes into the forwarded payload, requests stay anonymous.
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  if (!checkRateLimit(`study-request:${ip}`, LIMITS.studyRequest)) {
    console.log(JSON.stringify({ level: "warn", msg: "/api/study/request 429 rate limit hit", ip }));
    return NextResponse.json(
      { error: "Ai trimis prea multe cereri. Încearcă din nou peste o oră." },
      { status: 429, headers: { "Retry-After": "3600" } }
    );
  }

  let body: { type?: unknown; slug?: unknown; message?: unknown; contact?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cerere invalidă." }, { status: 400 });
  }

  const type = typeof body.type === "string" && body.type in REQUEST_TYPES
    ? (body.type as RequestType)
    : null;
  const slug = typeof body.slug === "string" && body.slug ? body.slug : null;
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const contact = typeof body.contact === "string" ? body.contact.trim().slice(0, 200) : "";

  if (!type) {
    return NextResponse.json({ error: "Tip de cerere invalid." }, { status: 400 });
  }
  if (slug && !isValidSlug(slug)) {
    return NextResponse.json({ error: "Materie invalidă." }, { status: 400 });
  }
  if (message.length < 10 || message.length > 1000) {
    return NextResponse.json(
      { error: "Mesajul trebuie să aibă între 10 și 1000 de caractere." },
      { status: 400 }
    );
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(JSON.stringify({ level: "warn", msg: "/api/study/request webhook not configured", ip }));
    return NextResponse.json(
      { error: "Trimiterea cererilor nu este configurată momentan." },
      { status: 503 }
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        embeds: [
          {
            title: `Cerere studiu: ${REQUEST_TYPES[type]}`,
            color: 0x5865f2,
            fields: [
              { name: "Materie", value: slug ?? "—" },
              { name: "Mesaj", value: message },
              { name: "Contact", value: contact || "—" },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    // Log the failure, never the message/contact content.
    console.log(JSON.stringify({ level: "error", msg: "/api/study/request webhook failed", ip, error: msg }));
    return NextResponse.json(
      { error: "Cererea nu a putut fi trimisă. Încearcă mai târziu." },
      { status: 502 }
    );
  }

  console.log(JSON.stringify({ level: "info", msg: "/api/study/request forwarded", ip, type, slug }));
  return NextResponse.json({ ok: true });
}

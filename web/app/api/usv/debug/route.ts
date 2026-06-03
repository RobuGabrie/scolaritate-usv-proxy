import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { curlGet } from "@/lib/usv/client";

const GRADES_URL = "/psc/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_GRADE.GBL";

export async function GET(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not found", { status: 404 });
  }

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Neautentificat" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") ?? "html";
  const path = searchParams.get("path") ?? GRADES_URL;

  try {
    const res = await curlGet(path, session.cookies);

    if (format === "fields") {
      // Return all PeopleSoft $N field bases + sample text per field
      const html = res.body;
      const matches = [...html.matchAll(/id="([^"]+\$(\d+))"/gi)];
      const bases: Record<string, { rows: number; sample: string }> = {};

      for (const m of matches) {
        const fullId = m[1];
        const base = fullId.replace(/\$\d+$/, "");
        const rowNum = parseInt(m[2]);

        if (!bases[base]) bases[base] = { rows: 0, sample: "" };
        if (rowNum + 1 > bases[base].rows) bases[base].rows = rowNum + 1;
        if (!bases[base].sample) {
          // Extract text content of the element
          const elMatch = html.match(new RegExp(`id="${fullId}"[^>]*>([^<]*)<`));
          bases[base].sample = elMatch?.[1]?.trim() ?? "";
        }
      }

      // Also extract table headers (simple extraction without 's' flag)
      const thMatches = [...html.matchAll(/<th[^>]*>([^<]*)<\/th>/gi)];
      const headers = thMatches.map(m => m[1].trim()).filter(Boolean);

      return NextResponse.json({ fields: bases, tableHeaders: headers, status: res.status });
    }

    if (format === "text") {
      // Return cleaned text (no HTML) for quick reading
      const text = res.body
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return new NextResponse(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }

    return new NextResponse(res.body, {
      status: res.status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Eroare" }, { status: 500 });
  }
}

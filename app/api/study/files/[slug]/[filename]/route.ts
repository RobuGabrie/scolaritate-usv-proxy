import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getAttachmentPath } from "@/lib/study/content";

export const dynamic = "force-dynamic";

// Attachments live in the volume-mounted content dir, so they can't go
// through public/ (baked at build time). Inline only types a browser renders
// safely; everything else (incl. svg, which can run scripts) downloads.
const INLINE_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".txt": "text/plain; charset=utf-8",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; filename: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Neautentificat." }, { status: 401 });
  }

  const { slug, filename } = await params;
  const decoded = decodeURIComponent(filename);
  const filePath = await getAttachmentPath(slug, decoded);
  if (!filePath) {
    return new NextResponse(null, { status: 404 });
  }

  const data = await fs.readFile(filePath);
  const ext = path.extname(decoded).toLowerCase();
  const contentType = INLINE_TYPES[ext] ?? "application/octet-stream";
  const disposition = ext in INLINE_TYPES ? "inline" : "attachment";

  return new NextResponse(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `${disposition}; filename="${encodeURIComponent(decoded)}"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    },
  });
}

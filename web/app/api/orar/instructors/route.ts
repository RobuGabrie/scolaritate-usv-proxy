import { NextResponse } from "next/server";

// orar.usv.ro does not expose an instructor list endpoint.
// Use /api/orar/instructor-schedule?name=X&facultyId=Y&sem=Z instead.
export async function GET() {
  return NextResponse.json(
    { error: "Endpoint not available. Use /api/orar/instructor-schedule instead." },
    { status: 410 },
  );
}

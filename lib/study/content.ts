import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

// Owner-authored markdown lives here; in production the folder is a read-only
// Docker volume mount, so it must be resolved at request time, never bundled.
const CONTENT_DIR = path.join(process.cwd(), "content", "study");

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/;
const FILENAME_RE = /^[\w][\w .()-]{0,120}$/;

export interface StudySubject {
  slug: string;
  title: string;
  year?: number;
  semester?: number;
  order?: number;
  updated?: string;
}

export interface StudySubjectDetail {
  meta: StudySubject;
  body: string;
  files: string[];
}

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export function isValidFilename(name: string): boolean {
  return FILENAME_RE.test(name) && !name.includes("/") && !name.includes("..");
}

function resolveInsideContentDir(...segments: string[]): string | null {
  const resolved = path.resolve(CONTENT_DIR, ...segments);
  if (!resolved.startsWith(CONTENT_DIR + path.sep)) return null;
  return resolved;
}

function parseMeta(slug: string, raw: string): { meta: StudySubject; body: string } {
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : slug,
      year: typeof data.year === "number" ? data.year : undefined,
      semester: typeof data.semester === "number" ? data.semester : undefined,
      order: typeof data.order === "number" ? data.order : undefined,
      updated:
        data.updated instanceof Date
          ? data.updated.toISOString().slice(0, 10)
          : data.updated
            ? String(data.updated).slice(0, 10)
            : undefined,
    },
    body: content,
  };
}

export async function listSubjects(): Promise<StudySubject[]> {
  let entries;
  try {
    entries = await fs.readdir(CONTENT_DIR, { withFileTypes: true });
  } catch {
    return []; // content dir missing (no volume mounted) — empty state
  }

  const subjects: StudySubject[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory() || !isValidSlug(entry.name)) continue;
    const indexPath = resolveInsideContentDir(entry.name, "index.md");
    if (!indexPath) continue;
    try {
      const raw = await fs.readFile(indexPath, "utf8");
      subjects.push(parseMeta(entry.name, raw).meta);
    } catch {
      continue; // folder without index.md is not a subject
    }
  }

  return subjects.sort(
    (a, b) =>
      (a.order ?? Infinity) - (b.order ?? Infinity) ||
      a.title.localeCompare(b.title, "ro")
  );
}

export async function getSubject(slug: string): Promise<StudySubjectDetail | null> {
  if (!isValidSlug(slug)) return null;
  const indexPath = resolveInsideContentDir(slug, "index.md");
  if (!indexPath) return null;

  let raw: string;
  try {
    raw = await fs.readFile(indexPath, "utf8");
  } catch {
    return null;
  }
  const { meta, body } = parseMeta(slug, raw);

  let files: string[] = [];
  const filesDir = resolveInsideContentDir(slug, "files");
  if (filesDir) {
    try {
      const entries = await fs.readdir(filesDir, { withFileTypes: true });
      files = entries
        .filter((e) => e.isFile() && isValidFilename(e.name))
        .map((e) => e.name)
        .sort((a, b) => a.localeCompare(b, "ro"));
    } catch {
      // no files/ dir — fine
    }
  }

  return { meta, body, files };
}

export async function getAttachmentPath(slug: string, filename: string): Promise<string | null> {
  if (!isValidSlug(slug) || !isValidFilename(filename)) return null;
  const filePath = resolveInsideContentDir(slug, "files", filename);
  if (!filePath) return null;
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) return null;
  } catch {
    return null;
  }
  return filePath;
}

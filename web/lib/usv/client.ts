import { execFile as execFileCb } from "child_process";
import { readFile, unlink } from "fs/promises";
import path from "path";
import { promisify } from "util";

const execFile = promisify(execFileCb);
export const USV_BASE = "https://scolaritate.usv.ro";
const OPENSSL_CONF = path.join(process.cwd(), "legacy-openssl.cnf");
const MAX_BUFFER = 10 * 1024 * 1024; // 10 MB

export interface CurlResult {
  status: number;
  body: string;
  setCookies: string[]; // "name=value" parts only
  ok: boolean;
}

const BASE_ARGS_FOLLOW = ["-sk", "--tlsv1.0", "-L", "--max-time", "15"];  // follow redirects
const BASE_ARGS_NOFOLLOW = ["-sk", "--tlsv1.0", "--max-time", "15"];       // stop at first redirect

const BASE_HEADERS = [
  "-H", "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
  "-H", "Accept: text/html,application/xhtml+xml",
  "-H", "Accept-Language: ro-RO,ro;q=0.9",
];

function parseHeaders(raw: string): { status: number; setCookies: string[] } {
  let status = 0;
  const setCookies: string[] = [];

  for (const line of raw.split(/\r?\n/)) {
    const lower = line.toLowerCase();
    if (lower.startsWith("http/")) {
      const m = line.match(/HTTP\/\S+\s+(\d+)/);
      if (m) status = parseInt(m[1]);
    } else if (lower.startsWith("set-cookie:")) {
      const val = line.slice("set-cookie:".length).trim().split(";")[0].trim();
      if (val) setCookies.push(val);
    }
  }

  return { status, setCookies };
}

async function curl(url: string, extra: string[], follow = true): Promise<CurlResult> {
  const fullUrl = url.startsWith("http") ? url : `${USV_BASE}${url}`;
  const headerFile = `/tmp/usv_hdr_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const baseArgs = follow ? BASE_ARGS_FOLLOW : BASE_ARGS_NOFOLLOW;

  const args = [...baseArgs, "-D", headerFile, ...BASE_HEADERS, ...extra, fullUrl];

  try {
    const { stdout } = await execFile("curl", args, {
      env: { ...process.env, OPENSSL_CONF },
      maxBuffer: MAX_BUFFER,
    });

    const rawHeaders = await readFile(headerFile, "utf8").catch(() => "");
    const { status, setCookies } = parseHeaders(rawHeaders);

    return { status, body: stdout, setCookies, ok: status >= 200 && status < 400 };
  } finally {
    unlink(headerFile).catch(() => {});
  }
}

// PeopleSoft embeds the last-visited URL in SignOnDefault cookie value,
// which can contain newlines (folded Set-Cookie header). Strip them before
// passing to curl — HTTP headers cannot contain bare CR/LF.
function sanitizeCookies(cookies: string): string {
  return cookies.replace(/\r?\n\s*/g, " ").replace(/\r/g, "");
}

export function curlGet(url: string, cookies?: string): Promise<CurlResult> {
  const extra: string[] = [];
  if (cookies) extra.push("-H", `Cookie: ${sanitizeCookies(cookies)}`);
  return curl(url, extra, true);
}

export function curlPost(
  url: string,
  body: string,
  cookies?: string,
  contentType = "application/x-www-form-urlencoded",
  follow = true
): Promise<CurlResult> {
  const extra = ["-X", "POST", "--data", body, "-H", `Content-Type: ${contentType}`];
  if (cookies) extra.push("-H", `Cookie: ${sanitizeCookies(cookies)}`);
  return curl(url, extra, follow);
}

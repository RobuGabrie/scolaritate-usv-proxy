import { curlGet, curlPost, USV_BASE } from "./client";

const LOGIN_URL = `${USV_BASE}/psp/PT90SYS/?cmd=login&languageCd=ROM`;
const LOGOUT_URL = `${USV_BASE}/psp/PT90SYS/EMPLOYEE/HRMS/?cmd=logout`;

export interface LoginResult {
  ok: boolean;
  cookies: string;
  userId: string;
  displayName: string;
  error?: string;
}

// Deduplicate cookies by name, keeping the last value for each name.
// This handles the PeopleSoft multi-redirect pattern where the session ID
// is reissued on every redirect — we only want the final (valid) one.
function mergeCookies(...batches: string[][]): string {
  const map = new Map<string, string>();
  for (const batch of batches) {
    for (const raw of batch) {
      const eq = raw.indexOf("=");
      if (eq < 0) continue;
      const name = raw.slice(0, eq).trim();
      const value = raw.slice(eq + 1).trim();
      if (value) map.set(name, `${name}=${value}`); // empty values are skipped
    }
  }
  return Array.from(map.values()).join("; ");
}

export async function loginToUSV(userid: string, pwd: string): Promise<LoginResult> {
  // Step 1: GET login page → collect the FINAL session cookie (after all redirects)
  const initRes = await curlGet(LOGIN_URL);
  const sessionCookies = mergeCookies(initRes.setCookies);

  // Step 2: POST credentials — do NOT follow redirects.
  // On success USV returns 302 with PS_TOKEN in Set-Cookie.
  // If we follow the redirect chain, a later response clears PS_TOKEN.
  const body = new URLSearchParams({ userid, pwd, timezoneOffset: "-120" }).toString();
  const loginRes = await curlPost(LOGIN_URL, body, sessionCookies, "application/x-www-form-urlencoded", false);

  // Merge cookies: login response overwrites init response values
  const allCookies = mergeCookies(initRes.setCookies, loginRes.setCookies);

  // Success = 302 redirect away from login page with a real PS_TOKEN
  const hasToken = allCookies.match(/PS_TOKEN=([^;]+)/) !== null &&
    !allCookies.includes("PS_TOKEN=;") &&
    allCookies.split("PS_TOKEN=")[1]?.trim().length > 5;

  const failed =
    loginRes.status === 200 ||          // stayed on login page
    !hasToken;                          // no valid auth token

  if (failed) {
    return { ok: false, cookies: "", userId: "", displayName: "", error: "ID sau parolă invalidă." };
  }

  const displayName = extractDisplayName(allCookies, userid);
  return { ok: true, cookies: allCookies, userId: userid, displayName };
}

export async function logoutFromUSV(cookies: string): Promise<void> {
  try {
    await curlGet(LOGOUT_URL, cookies);
  } catch {
    // ignore logout errors
  }
}

function extractDisplayName(cookies: string, fallback: string): string {
  const m = cookies.match(/SignOnDefault=([^;]+)/);
  const raw = m ? decodeURIComponent(m[1]) : fallback;
  return raw
    .split(/[.\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

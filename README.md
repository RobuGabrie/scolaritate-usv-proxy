# Scolaritate+

A faster, mobile-friendly frontend for USV's student portal — no VPN required on your device.

USV's portal (scolaritate.usv.ro) only works on campus or over VPN, runs on legacy TLS 1.0, and hasn't been redesigned since roughly 2009. This app runs on a server that's already inside the university network, proxies the requests, and gives you a clean interface for the things you actually check: grades, timetable, and profile.

## What it does

- **Grades** — full grade list with semester filtering and a calculator that shows what you need in remaining subjects to hit a target average
- **Timetable** — weekly and daily views, pinch to zoom on mobile, tap a professor to see their full schedule across all groups
- **Profile** — basic academic info pulled straight from the student system

Everything is read-only. No data is stored beyond your session cookie, which expires after 8 hours.

## How it works

Next.js 15 frontend with server-side API routes that proxy to USV on your behalf. When you log in, the app authenticates against USV's PeopleSoft system using `curl` (legacy TLS 1.0 is required — their server hasn't been updated). Your session cookies get signed into a JWT stored in an httpOnly cookie on your browser. All subsequent requests go server-side.

The VPN connection lives in a Docker sidecar container. Your device never needs to be on the university network.

## Running it

You need Docker and a machine that can reach the USV network (or credentials for the VPN sidecar to handle it).

```bash
cp .env.example .env
# edit .env with your values
docker compose up -d
```

Runs on port 3000. In production, a `cloudflared` container exposes it via a Cloudflare Tunnel so no ports need to be open on the host.

### Environment variables

| Variable | What it's for |
|----------|---------------|
| `VPN_USERNAME` | USV account used for the VPN connection (`name@student.usv.ro`) |
| `VPN_PASSWORD` | Password for that account |
| `JWT_SECRET` | Random secret for signing session tokens — `openssl rand -base64 32` |
| `CLOUDFLARE_TUNNEL_TOKEN` | From Cloudflare Zero Trust → Tunnels, if you're using that |
| `GRAFANA_PASSWORD` | Password for the Grafana admin account (default: `changeme` — change it) |

The VPN account doesn't need to be the same one students log in with. It just needs to be a valid USV account to bring up the OpenVPN tunnel.

## Monitoring

Grafana, Loki, and Promtail run as part of the Docker Compose stack. Promtail reads container logs via the Docker socket and ships them to Loki. Grafana sits on top with a dashboard showing log volume, login attempts, rate limit hits, errors, and VPN logs.

Grafana runs on port 3001. Log in with `admin` / whatever you set `GRAFANA_PASSWORD` to. The dashboard is pre-provisioned — it'll be there as soon as containers are up.

## Stack

- Next.js 15 (App Router)
- Tailwind CSS v4
- `jose` for JWT sessions
- `curl` for proxying to PeopleSoft (legacy TLS 1.0)
- `node-html-parser` for timetable parsing from orar.usv.ro
- Docker + OpenVPN sidecar + Cloudflare Tunnel

## Caveats

USV's PeopleSoft is slow. Grade pages can take 5–8 seconds to load — that's their server, not this app. The timetable (orar.usv.ro) is a public endpoint and loads fast.

If the VPN sidecar disconnects, everything breaks until it reconnects. The healthcheck in docker-compose handles automatic restarts.

This runs on a single server. Don't expect it to hold up if the entire student body hits it simultaneously — the upstream USV system would rate-limit the server IP well before that.

## Disclaimer

Unofficial student project. Not affiliated with USV. Your credentials go directly to USV's servers — this app just handles the TLS/VPN layer so you don't have to set it up yourself.

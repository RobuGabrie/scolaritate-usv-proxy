# Plan Structural — Școlaritate USV

## Viziune
Portal modern pentru studenții USV. Prioritate absolută: note clare, complete, cu calculator de medie.
Autentificare directă prin proxy la USV — zero stocare credențiale.

---

## Pagini & Routing

```
/                   → redirect → /note (dacă autentificat) sau /login
/login              → pagina de autentificare
/note               → pagina principală ★
/note/calculator    → calculator medie dorită
/orar               → orar săptămânal
/examene            → sesiune examene
/profil             → date personale
```

---

## Autentificare

**Flow:**
1. User introduce `userid` + `pwd` pe `/login`
2. Next.js API Route `POST /api/auth/login`:
   - Face request prin proxy la USV cu `OPENSSL_CONF` legacy
   - Salvează cookie-urile USV (`PTSYS2-*`, `PS_TOKEN`) într-un cookie httpOnly semnat JWT
   - Nicio credențiale stocate — doar sesiunea USV
3. Middleware Next.js verifică JWT pe fiecare request protejat
4. La expirare sesiune USV → redirect automat la `/login`

**Securitate:**
- Credențiale trec doar în memorie, niciodată loggate sau stocate
- Cookie httpOnly + SameSite=strict
- HTTPS obligatoriu în producție

---

## Pagina Note ★ (prioritatea 1)

### Layout

```
┌─ Header ─────────────────────────────────────────┐
│ Note          An academic [2025-2026 ▾]  [SEM 1 | SEM 2 | Toate] │
├─────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│ │ Media    │ │ Credite  │ │ Promovate        │  │
│ │ ECTS     │ │ totale   │ │ x / y materii    │  │
│ └──────────┘ └──────────┘ └──────────────────┘  │
├─────────────────────────────────────────────────┤
│ SEMESTRUL 1 ──────────────────────────────────  │
│                                                  │
│  Materie          Pondere  Curs  Lab  Final  Cr  │
│  ─────────────────────────────────────────────  │
│  Structuri Date   50/50     5.8  7.7  [  7 ]  6  │
│  Sisteme Operare  50/50    10.0 10.0  [ 10 ] 6   │
│  ...                                             │
│                                                  │
│ SEMESTRUL 2 ──────────────────────────────────  │
│  Proiect. Alg.    50/50     5.0   —   [  — ]  4  │
│  ...                                             │
└─────────────────────────────────────────────────┘
```

### Coloane tabel note

| Coloană | Detalii |
|---|---|
| Materie | Titlu complet, trunchiabil pe mobile |
| Pondere | `50 / 50` — curs/laborator |
| Nota curs | număr sau `—` dacă lipsește |
| Nota lab/seminar | număr sau `—` |
| Nota finală | badge colorat (verde/albastru/portocaliu/roșu) |
| Credite | număr ECTS |
| Puncte | credite × nota (ascuns pe mobile) |

### Note estimate
Dacă nota finală lipsește dar există nota curs + nota lab → calculează automat nota estimată pe baza ponderii și o afișează italic cu `~` prefix.

### Filtrare
- Selector segmentat: `Toate | SEM 1 | SEM 2`
- Selector an academic: dropdown cu toți anii disponibili (multi-year support)

### Ani multipli
- USV returnează note din toți anii
- Restanțe din ani anteriori marcate cu badge `RESTANȚĂ`
- Materie recontractată → afișată în anul original, nu duplicată

---

## Calculator Medie (/note/calculator)

### Funcționalitate
1. Afișează toate materiile din semestrul curent cu nota actuală
2. Câmpuri editabile pentru notele lipsă sau viitoare
3. Calculează în timp real:
   - Media ECTS ponderată (credite × notă / total credite)
   - Media aritmetică simplă
4. Input „Medie dorită" → calculează ce notă medie trebuie luată la materiile rămase
5. Reset la notele reale

### Formula medie ECTS
```
Media = Σ(notaFinala × credite) / Σ(credite)
```
Materii cu nota lipsă → excluse din calcul (nu penalizează).
Materii cu `ABS` → contează ca 0.

---

## Pagina Orar (/orar)

- Grid vizual pe zile (Luni–Vineri)
- Ore, sală, profesor, tip (curs/laborator/seminar)
- Selector săptămână (A/B dacă există)
- Export `.ics` pentru Google Calendar / Apple Calendar

---

## Pagina Examene (/examene)

- Listă examene cu dată, oră, sală
- Badge countdown „în X zile"
- Sortate cronologic

---

## Pagina Profil (/profil)

- Nume, facultate, specializare, an de studiu, grupa
- Buton deconectare

---

## Arhitectura Tehnică

### Stack
```
Next.js 15 (App Router, TypeScript)
Tailwind CSS v4 + shadcn/ui
next-themes (dark/light)
```

### Structura foldere
```
apps/web/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx          ← sidebar + header
│   │   ├── note/
│   │   │   ├── page.tsx
│   │   │   └── calculator/
│   │   │       └── page.tsx
│   │   ├── orar/
│   │   │   └── page.tsx
│   │   ├── examene/
│   │   │   └── page.tsx
│   │   └── profil/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── logout/route.ts
│   │   └── usv/
│   │       ├── note/route.ts
│   │       ├── orar/route.ts
│   │       └── examene/route.ts
│   ├── middleware.ts            ← protejează rutele dashboard
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── usv/
│   │   ├── client.ts           ← fetch cu TLS legacy
│   │   ├── auth.ts             ← login/logout USV
│   │   ├── gradeParser.ts      ← parser HTML → note structurate
│   │   ├── orarParser.ts
│   │   └── types.ts            ← tipuri TypeScript
│   ├── gradeCalculator.ts      ← logica medie ECTS + simulator
│   └── session.ts              ← JWT cookie helpers
├── components/
│   ├── ui/                     ← shadcn components
│   ├── grades/
│   │   ├── GradeTable.tsx
│   │   ├── GradeRow.tsx
│   │   ├── GradeStats.tsx
│   │   └── GradeCalculator.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── theme-toggle.tsx
└── research/                   ← documentație cercetare
```

### Proxy USV (lib/usv/client.ts)
```typescript
// Setat o singură dată la startup
process.env.OPENSSL_CONF = path.join(process.cwd(), 'legacy-openssl.cnf');

export async function usvFetch(url: string, cookies: string, options = {}) {
  const agent = new https.Agent({ rejectUnauthorized: false, minVersion: 'TLSv1' });
  return fetch(url, { ...options, agent, headers: { Cookie: cookies } });
}
```

### Sesiune (lib/session.ts)
- JWT semnat cu `AUTH_SECRET` (env var)
- Conține: cookies USV (criptate), userid, timestamp
- Stocat în cookie httpOnly, expiră când expiră sesiunea USV

---

## Ordinea implementării

### Etapa 1 — Fundație (acum)
- [x] Next.js + shadcn + tema Linear
- [ ] Restructurare foldere (auth) / (dashboard)
- [ ] `lib/usv/client.ts` — proxy cu TLS legacy
- [ ] `lib/usv/auth.ts` — login/logout USV
- [ ] `lib/session.ts` — JWT cookie
- [ ] `/login` — pagina de autentificare
- [ ] `middleware.ts` — protecție rute

### Etapa 2 — Note (core)
- [ ] `app/api/usv/note/route.ts` — fetch + parse note
- [ ] `lib/usv/gradeParser.ts` — parser HTML complet
- [ ] `lib/usv/types.ts` — tipuri TypeScript
- [ ] `app/(dashboard)/note/page.tsx` — pagina note completă
- [ ] `components/grades/GradeTable.tsx`
- [ ] `components/grades/GradeStats.tsx`
- [ ] Multi-year support + restanțe

### Etapa 3 — Calculator
- [ ] `lib/gradeCalculator.ts` — logica ECTS
- [ ] `app/(dashboard)/note/calculator/page.tsx`
- [ ] `components/grades/GradeCalculator.tsx`

### Etapa 4 — Orar & Examene
- [ ] Parser orar + examene
- [ ] Pagini orar + examene
- [ ] Export .ics

### Etapa 5 — Deploy
- [ ] `legacy-openssl.cnf` în root proiect
- [ ] Dockerfile + Docker Compose
- [ ] VPN în container separat
- [ ] Oracle Cloud / Hetzner setup

---

## Ce face mai bine față de USV-PROXY

| Feature | USV-PROXY | Al nostru |
|---|---|---|
| TypeScript | ✗ JS | ✓ TS complet |
| Multi-year | ✓ | ✓ |
| Calculator medie | ✓ basic | ✓ ECTS + aritmetică + simulator |
| Dark/Light mode | ✗ | ✓ |
| Mobile | ✗ | ✓ responsive complet |
| Export .ics | ✗ | ✓ |
| Nota estimată auto | ✓ | ✓ |
| Restanțe marcate | ✓ | ✓ |
| Deploy self-hosted | ✓ Docker | ✓ Docker + Oracle Free |

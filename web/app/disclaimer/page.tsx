import Link from "next/link";

function IconGitHub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function IconServer() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function IconWifi() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
      {children}
    </span>
  );
}

function Section({
  icon,
  title,
  children,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div
      className="animate-login-fade rounded-2xl border border-border bg-card p-5 sm:p-6"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
          {icon}
        </span>
        <h2 className="text-[13px] font-semibold text-foreground tracking-tight">{title}</h2>
      </div>
      <div className="text-[13px] text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl bg-destructive/8 border border-destructive/20 px-4 py-3 text-[12.5px] text-destructive/90 leading-relaxed">
      <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      {children}
    </div>
  );
}

export default function DisclaimerPage() {
  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center px-4 py-14 bg-background"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 90% 40% at 50% 0%, rgba(109, 120, 213, 0.13) 0%, transparent 70%)",
      }}
    >
      <div className="w-full max-w-[560px]">

        {/* Header */}
        <div className="animate-login-fade [animation-delay:0ms] mb-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <IconArrowLeft />
            Înapoi la autentificare
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_15%,transparent)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-medium">Proiect open-source</p>
              <h1 className="text-[22px] font-bold tracking-[-0.02em] text-foreground leading-none mt-0.5">Școlaritate</h1>
            </div>
          </div>

          <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
            O platformă independentă care face portalul academic USV accesibil din orice browser,
            fără VPN și fără configurări suplimentare.
          </p>

          <div className="flex flex-wrap gap-2">
            <Chip>Fără VPN</Chip>
            <Chip>Open Source · MIT</Chip>
            <Chip>Parola nu se salvează</Chip>
            <Chip>Realizat de studenți</Chip>
          </div>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-3">

          <Section icon={<IconInfo />} title="Despre proiect" delay={80}>
            <p>
              <strong className="text-foreground">Școlaritate</strong> este un proiect personal realizat de{" "}
              <strong className="text-foreground">Robu Gabriel</strong>, student la Universitatea
              „Ștefan cel Mare" din Suceava (USV). Platforma a apărut din necesitate practică:
              accesul la portalul oficial de note era blocat în toate browserele moderne din cauza
              unui protocol de securitate depășit.
            </p>
            <p>
              Proiectul <strong className="text-foreground">nu este afiliat, sponsorizat sau
              aprobat</strong> de Universitatea „Ștefan cel Mare" din Suceava, de Ministerul
              Educației sau de orice altă instituție oficială. Orice asemănare cu o interfață
              oficială este pur coincidentală.
            </p>
            <WarningBox>
              Folosești această platformă pe propria răspundere.
            </WarningBox>
          </Section>

          <Section icon={<IconWifi />} title="De ce există această platformă" delay={140}>
            <p>
              Portalul oficial{" "}
              <code className="text-[11.5px] bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">scolaritate.usv.ro</code>{" "}
              utilizează <strong className="text-foreground">TLS 1.0</strong> — un protocol de
              criptare publicat în 1999, considerat nesigur conform standardelor actuale (RFC 8996,
              NIST SP 800-52) și dezactivat implicit în toate browserele moderne începând cu 2020
              (Chrome 84+, Firefox 78+, Safari 13.1+, Edge 84+).
            </p>
            <p>
              Consecința practică: studenții nu pot accesa notele, orarul sau situația școlară
              din browser fără a instala un VPN al universității sau a reactiva manual TLS 1.0
              în setările sistemului — o vulnerabilitate de securitate în sine.
            </p>
            <p>
              Această platformă rezolvă incompatibilitatea acționând ca un{" "}
              <strong className="text-foreground">intermediar (proxy)</strong>: serverul nostru
              preia cererea ta, comunică cu portalul USV (care acceptă TLS 1.0 pe server), și
              îți returnează răspunsul — direct în browser, fără configurări.
            </p>
          </Section>

          <Section icon={<IconServer />} title="Cum funcționează tehnic" delay={200}>
            <p>
              Fluxul complet al unei autentificări:
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-[12.5px] marker:text-primary/60">
              <li>Introduci emailul și parola în formular — datele sunt trimise prin HTTPS către serverul nostru.</li>
              <li>Serverul transmite credențialele mai departe către <code className="text-[11px] bg-muted px-1 py-0.5 rounded font-mono text-foreground">scolaritate.usv.ro</code> folosind TLS 1.0.</li>
              <li>Portalul USV returnează un <strong className="text-foreground">token de sesiune</strong> — identic cu ce primești la autentificarea directă.</li>
              <li>Credențialele sunt <strong className="text-foreground">șterse imediat</strong> din memorie. Token-ul de sesiune este criptat și stocat temporar.</li>
              <li>Toate cererile ulterioare (note, orar, profil) sunt făcute în numele tău folosind acel token, exact ca un browser normal.</li>
            </ol>
            <p className="text-[12px]">
              Sesiunea expiră automat după <strong className="text-foreground">8 ore</strong> sau
              la apăsarea butonului de deconectare. La expirare, token-ul este șters permanent.
            </p>
          </Section>

          <Section icon={<IconShield />} title="Datele tale" delay={260}>
            <p>
              <strong className="text-foreground">Nu salvăm, nu stocăm și nu transmitem
              parola ta</strong> nicăieri. Parola este folosită exclusiv pentru autentificarea
              inițială la portalul USV și este ștearsă imediat după.
            </p>
            <p>
              Singurul element stocat pe server este <strong className="text-foreground">token-ul
              de sesiune</strong> emis de USV — în formă criptată, cu durată limitată. Acest token
              nu poate fi folosit pentru a-ți accesa alte servicii și expiră odată cu sesiunea USV.
            </p>
            <p>
              Nu colectăm date analitice, nu folosim cookie-uri de tracking și nu transmitem
              niciun fel de date către terți. Nu există baze de date cu informații personale.
            </p>
            <div className="rounded-xl bg-primary/8 border border-primary/20 px-4 py-3 text-[12.5px] text-primary/90 leading-relaxed">
              Emailul introdus în câmpul „Ține minte emailul" este salvat <strong>exclusiv local</strong>,
              în browserul tău (localStorage), și nu este transmis nicăieri în afara autentificării normale.
            </div>
          </Section>

          <Section icon={<IconCode />} title="Transparență și cod sursă" delay={320}>
            <p>
              Codul sursă complet al platformei este disponibil public pe GitHub sub licența{" "}
              <strong className="text-foreground">MIT</strong>. Poți verifica în orice moment
              exact cum funcționează autentificarea, cum sunt gestionate datele și ce se
              întâmplă cu credențialele tale.
            </p>
            <p>
              Contribuțiile și raportările de probleme sunt binevenite. Dacă identifici o
              vulnerabilitate de securitate, te rugăm să o raportezi responsabil înainte de
              publicare.
            </p>
            <a
              href="https://github.com/RobuGabrie/scolaritate-usv-proxy"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[12.5px] text-primary hover:opacity-80 transition-opacity font-medium"
            >
              <IconGitHub />
              github.com/RobuGabrie/scolaritate-usv-proxy
            </a>
          </Section>

          {/* Legal disclaimer card */}
          <div
            className="animate-login-fade rounded-2xl border border-destructive/25 bg-destructive/5 p-5 sm:p-6"
            style={{ animationDelay: "380ms" }}
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-destructive/15 text-destructive shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </span>
              <h2 className="text-[13px] font-semibold text-foreground tracking-tight">Limitarea răspunderii</h2>
            </div>
            <div className="text-[13px] text-muted-foreground leading-relaxed space-y-3">
              <p>
                Platforma este oferită <strong className="text-foreground">„ca atare"</strong>,
                fără nicio garanție explicită sau implicită de disponibilitate, continuitate,
                acuratețe sau adecvare pentru un scop anume.
              </p>
              <p>
                Autorul nu își asumă răspunderea pentru:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[12.5px] marker:text-destructive/50">
                <li>întreruperi sau indisponibilitate ale serviciului</li>
                <li>modificări ale portalului oficial USV care afectează funcționarea</li>
                <li>date inexacte returnate de serverele USV</li>
                <li>orice consecință rezultată din utilizarea sau imposibilitatea utilizării platformei</li>
                <li>acțiuni disciplinare sau de altă natură din partea universității față de utilizatori</li>
              </ul>
              <p className="text-[12px]">
                <strong className="text-foreground">Prin utilizarea acestei platforme confirmi că ai citit,
                înțeles și acceptat acest disclaimer în integralitatea sa.</strong> Dacă nu ești de acord
                cu oricare dintre termenii de mai sus, nu utiliza platforma.
              </p>
            </div>
          </div>

        </div>

        {/* Donation */}
        <div
          className="animate-login-fade mt-3 rounded-2xl border border-border bg-card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ animationDelay: "440ms" }}
        >
          <div>
            <p className="text-[13px] font-semibold text-foreground mb-1">Susține proiectul</p>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed max-w-[320px]">
              Platforma este gratuită și fără reclame. Dacă ți-a fost utilă, o donație simbolică
              ajută la acoperirea costurilor de hosting.
            </p>
          </div>
          <a
            href="https://revolut.me/robugabi2004"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-foreground text-background text-[12.5px] font-medium hover:opacity-[0.88] active:opacity-75 transition-opacity"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
            </svg>
            Donează pe Revolut
          </a>
        </div>

        {/* Footer */}
        <div
          className="animate-login-fade mt-8 pt-6 border-t border-border flex items-center justify-between"
          style={{ animationDelay: "500ms" }}
        >
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-[12.5px] text-primary hover:opacity-80 transition-opacity font-medium"
          >
            <IconArrowLeft />
            Înapoi la autentificare
          </Link>
          <span className="text-[11px] text-muted-foreground/40">MIT · Robu Gabriel · 2024</span>
        </div>

      </div>
    </div>
  );
}

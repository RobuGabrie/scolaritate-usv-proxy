import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-[540px]">

        {/* Logo */}
        <Link href="/login" className="flex items-center gap-2 mb-10 w-fit">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span className="text-[14px] font-medium tracking-tight text-foreground">Școlaritate</span>
        </Link>

        <h1 className="text-[22px] font-semibold text-foreground mb-1">Disclaimer</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Citește cu atenție înainte de a folosi platforma.
        </p>

        <div className="space-y-6 text-sm text-foreground/80 leading-relaxed">

          <section>
            <h2 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-2">
              Proiect independent
            </h2>
            <p>
              Această platformă este un proiect personal, realizat de{" "}
              <strong>Robu Gabriel</strong>, student la Universitatea „Ștefan cel Mare" din Suceava.
              Nu este afiliată, susținută sau aprobată de USV sau de nicio structură oficială a acesteia.
              Folosești platforma pe propria răspundere.
            </p>
          </section>

          <section>
            <h2 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-2">
              De ce există
            </h2>
            <p>
              Portalul oficial{" "}
              <code className="text-[12px] bg-muted px-1.5 py-0.5 rounded">scolaritate.usv.ro</code>{" "}
              folosește TLS 1.0, un protocol considerat nesigur și dezactivat implicit în toate
              browser-ele moderne. Asta îl face inaccesibil fără VPN sau configurări speciale.
              Platforma aceasta acționează ca un intermediar care preia cererea ta, o transmite
              portalului USV și îți returnează răspunsul — rezolvând incompatibilitatea fără
              a necesita nicio configurare din partea ta.
            </p>
          </section>

          <section>
            <h2 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-2">
              Ce se întâmplă cu datele tale
            </h2>
            <p>
              Credențialele (utilizator și parolă) sunt transmise direct serverului USV în
              momentul autentificării și <strong>nu sunt salvate</strong> nicăieri.
              Pe server se reține temporar, în formă criptată, doar token-ul de sesiune emis
              de USV — exact ce un browser normal ar stoca în cookies. Sesiunea expiră automat
              după 8 ore sau la deconectare.
            </p>
          </section>

          <section>
            <h2 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-2">
              Transparență
            </h2>
            <p>
              Codul sursă al platformei este public, disponibil pe GitHub, sub licența MIT.
              Poți verifica oricând exact cum funcționează și cum sunt gestionate datele tale.
            </p>
          </section>

          <section>
            <h2 className="text-[12px] font-semibold text-foreground uppercase tracking-wider mb-2">
              Limitarea răspunderii
            </h2>
            <p>
              Platforma este oferită „ca atare", fără nicio garanție de disponibilitate sau
              acuratețe. Autorul nu își asumă răspunderea pentru întreruperi de serviciu,
              modificări ale portalului USV sau orice alte consecințe rezultate din utilizare.
              Prin folosirea platformei, accepți aceste condiții.
            </p>
          </section>

        </div>

        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <Link
            href="/login"
            className="text-sm text-primary hover:opacity-80 transition-opacity flex items-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Înapoi la autentificare
          </Link>
          <span className="text-[11px] text-muted-foreground/40">MIT · Robu Gabriel</span>
        </div>

      </div>
    </div>
  );
}

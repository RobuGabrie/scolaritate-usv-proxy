---
title: "Programare Web (PAWEB)"
faculty: FIESC
updated: 2026-06-10
---

# 📘 Programare Web — Ghid Complet pentru Examen

> **Formatul examenului:** 3 întrebări scrise — **1 din HTML/CSS** + **2 din partea de server** (Node.js / Express / MySQL / Securitate / Autentificare).
>
> Fiecare secțiune explică mai întâi conceptul **în cuvinte simple**, apoi arată **codul exact din demonstrațiile cursului** (`curs/01` … `curs/13`) — scrie-l la examen exact așa cum apare aici. Înțelege povestea, iar codul devine ceva ce **reconstruiești**, nu ceva ce memorezi.

### 🔣 Legendă simboluri

| Simbol | Înseamnă |
|---|---|
| 💡 | Idee-cheie de reținut |
| ⚠️ | Capcană / greșeală frecventă |
| 🎯 | Formulare gata de scris la examen |
| 🧠 | Truc de memorare |

### 🗺️ Harta materiei — ce curs acoperă ce secțiune

| Curs | Subiect | Secțiune în ghid | Șanse la examen |
|---|---|---|---|
| 01 | Introducere, istoria web-ului | 2.1 | 🟡 medie |
| 02 | HTML | 1.1 | 🔴 mare |
| 03 | CSS — bazele, box model | 1.2 | 🔴 mare |
| 04 | CSS — unități, responsive, grid | 1.3 | 🔴 mare |
| 05–06 | JavaScript front-end, DOM | Partea 3 | 🟢 mică (sprijin) |
| 07 | Node.js, npm, Express | 2.2 | 🔴 mare |
| 08 | Servere statice, API, SSR/CSR | 2.1 + 2.2 | 🔴 mare |
| 09 | Async (Promises) + MySQL | 2.3 + 2.4 | 🔴 foarte mare |
| 10 | Securitate (hash, XSS, SQL injection) | 2.5 | 🔴 foarte mare |
| 11–12 | Web Components (vanilla + Lit) | Partea 3 | 🟢 mică |
| 13 | Cookies, sesiuni, autentificare | 2.6 | 🔴 mare |

---

# 🧱 PARTEA 1 — HTML & CSS (1 întrebare)

## 1.1 HTML — ce este și cum e structurat un document (curs 02)

HTML **nu este un limbaj de programare** — nu calculează nimic. Este un **sistem de etichetare a conținutului**: pui etichete (taguri) în jurul textului, imaginilor și linkurilor, ca browserul să știe **ce este** fiecare bucată.

**Cele două jumătăți ale oricărei pagini:**

```text
┌─────────────────────────────────────────┐
│  <head>  = plicul scrisorii             │
│  informații DESPRE pagină               │
│  (titlu, codificare, ce CSS se încarcă) │
│  ❌ NU se afișează pe ecran             │
├─────────────────────────────────────────┤
│  <body>  = scrisoarea în sine           │
│  tot ce este VIZIBIL pentru utilizator  │
│  ✅ se afișează pe ecran                │
└─────────────────────────────────────────┘
```

💡 **De ce `<!DOCTYPE html>` trebuie să fie prima linie:** îi spune browserului „interpretează pagina după regulile moderne" (*standards mode*). Fără el, browserul cade înapoi pe comportamente ciudate din anii '90.

💡 **De ce `<meta charset="UTF-8">`:** îi spune browserului cum să transforme octeții fișierului în litere. Dacă îl uiți, diacriticele (ă, ș, ț…) apar ca semne ciudate.

**Scheletul (de memorat — e baza oricărui răspuns despre HTML):**

```html
<!DOCTYPE html>                 <!-- prima linie; mod standard -->
<html lang="en">                <!-- elementul rădăcină; lang pentru screen readere/SEO -->
  <head>                        <!-- metadate, NU se afișează -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="..." />
    <title>Titlul paginii</title>
    <link rel="icon" href="favicon.svg" />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- conținutul vizibil -->
  </body>
</html>
```

### Element vs atribut — gramatica HTML-ului

```text
      atribut = informație extra, ca un adjectiv
         │
         ▼
<a href="pagina.html">Apasă aici</a>
└──────── element = tot „sandvișul" ─┘
   tag de deschidere + conținut + tag de închidere
```

- Un **element** este întregul ansamblu: `<p>text</p>`.
- Un **atribut** stă în tagul de deschidere și dă detalii: `href` spune linkului *unde* să meargă. Atribute frecvente: `id`, `class`, `src`, `href`, `alt`, `style`, `lang`, `title`.
- Unele elemente **nu au conținut** de împachetat, deci nu au tag de închidere (**elemente void**): `<br>`, `<hr>`, `<img>`, `<input>`, `<meta>`, `<link>`. Gândește-te: o imagine nu „conține" text.

### Entitățile HTML — caractere rezervate

Unele caractere aparțin chiar limbajului HTML. Dacă scrii `<` în text, browserul crede că începe un tag — așa că scrii `&lt;` în loc.

🧠 **Truc:** `&` + abreviere + `;`

| Scrii | Se afișează |
|---|---|
| `&lt;` | < |
| `&gt;` | > |
| `&amp;` | & |
| `&quot;` | " |
| `&nbsp;` | spațiu |

⚠️ **Reține ideea — se întoarce ca soluție pentru XSS în secțiunea 2.5!**

### Taguri semantice — de ce există

`<div>` este o cutie anonimă; nu spune nimic browserului. Tagurile semantice — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` — sunt cutii **cu nume care le descrie rolul**, nu aspectul.

🧠 **Analogie:** mutatul cu cutii neetichetate (`<div>`) vs cutii etichetate „bucătărie", „fragil" (taguri semantice). Același conținut, dar etichetele ajută pe toată lumea:

1. **Screen readerele** pot sări direct la conținutul principal (accesibilitate).
2. **Motoarele de căutare** înțeleg structura → SEO mai bun.
3. **Programatorii** citesc codul mai repede.

Un layout tipic se mapează direct pe ele:

```text
┌────────────────────────────────────┐
│             <header>               │
├────────────────────────────────────┤
│              <nav>                 │
├──────────────────────────┬─────────┤
│         <main>           │         │
│  ┌────────────────────┐  │ <aside> │
│  │     <article>      │  │         │
│  │    <section>...    │  │         │
│  └────────────────────┘  │         │
├──────────────────────────┴─────────┤
│             <footer>               │
└────────────────────────────────────┘
```

💡 `<div>` vs `<span>`: ambele sunt containere fără semnificație; `div` este **block** (ocupă propria linie), `span` este **inline** (curge în interiorul textului) — vezi secțiunea `display` mai jos.

### Taguri pe care trebuie să le poți enumera / exemplifica

- Titluri `<h1>`–`<h6>`; text: `<p>`, `<br>`, `<hr>`, `<strong>`, `<em>`, `<code>`, `<pre>`
- Liste: `<ul>`/`<ol>` + `<li>`; liste de definiții `<dl>` + `<dt>`/`<dd>`
- Tabele: `<table>`, `<tr>`, `<th>`, `<td>`, `<thead>`, `<tbody>`
- Linkuri: `<a href="#id-sectiune">` (ancoră internă) vs `<a href="https://...">` (extern)
- Media: `<img src alt>`, `<video>`, `<audio>`, `<iframe>`

### Formulare — puntea către server (relevant și pentru întrebările de server!)

Un formular este modul clasic prin care utilizatorul **trimite date către server**. Trei lucruri de înțeles:

1. `action` = **unde** merg datele (la ce URL).
2. `method` = **cum** călătoresc: `GET` pune datele **în URL** ca *query string* (`/sum?a=1&b=2`), `POST` le pune **în corpul cererii** (invizibile în URL — de aceea login-urile folosesc POST).
3. Atributul `name` al fiecărui input devine **cheia** datelor. Fără `name`, datele nu se trimit.

```html
<form method="GET" action="/sum">
  <input type="text" name="a" />
  <input type="text" name="b" />
  <button type="submit">Trimite</button>
</form>
<!-- la trimitere se formează: /sum?a=1&b=2  (QUERY STRING-ul) -->
```

```text
  FORMULAR                                   SERVER (Express)
  name="a" ──┐                                  ┌── req.query.a
             ├──▶  /sum?a=1&b=2  ──────────────▶┤
  name="b" ──┘     (query string)               └── req.query.b
```

💡 Când vezi mai târziu `req.query.a` în Express, acel `a` este chiar `name="a"` din formular. Formularul și serverul sunt cele două capete ale aceleiași țevi.

## 1.2 CSS — bazele (curs 03)

CSS răspunde mereu la o singură întrebare: **„care elemente primesc ce stil vizual?"** Fiecare regulă are exact două părți:

```text
   selector → CINE este stilizat
      │
      ▼
      p {
        color: red;        ◀── declarații → CE se schimbă
        font-size: 16px;       (proprietate: valoare;)
      }
```

```css
/* comentariu */
p {
  color: red;          /* nume, #ff0000, rgb(255,0,0), hsl(...) */
  font-family: Arial, sans-serif;
  font-size: 16px;
}
```

### Cele trei moduri de a adăuga CSS — și de ce câștigă cel extern (întrebare clasică de examen)

| # | Mod | Cum arată | Analogie | Verdict |
|---|---|---|---|---|
| 1 | **Inline** | `<p style="color:red">` | un bilețel lipit pe fiecare obiect din casă — actualizezi fiecare bilețel în parte | ❌ de evitat (specificitate maximă) |
| 2 | **Intern** | bloc `<style>` în `<head>` | un regulament, dar lipit într-o singură pagină; celelalte pagini nu-l pot folosi | 🟡 acceptabil |
| 3 | **Extern** | `<link rel="stylesheet" href="style.css" />` | un regulament pentru tot site-ul: schimbi un fișier → tot site-ul se actualizează | ✅ recomandat |

🎯 **Răspuns complet de examen pentru „de ce extern":** *separarea responsabilităților* (conținutul și aspectul în fișiere diferite), *reutilizare* pe mai multe pagini, *caching* (browserul reține fișierul).

### Selectori și specificitate — cine câștigă un conflict

Selectorii sunt criterii de căutare pe pagină:

| Selector | Exemplu | Selectează |
|---|---|---|
| element | `p` | toate `<p>`-urile (larg) |
| `.clasă` | `.menu` | toate elementele cu `class="menu"` — o clasă e o etichetă pe care o lipești pe **multe** elemente |
| `#id` | `#header` | elementul cu `id="header"` — un id trebuie să fie **unic** pe pagină |
| universal | `*` | totul |
| grupare | `h1, h2` | ambele (scurtătură: o regulă pentru amândouă) |
| descendent | `nav a` | `<a>` din interiorul `<nav>` — „linkuri, dar doar cele din nav" |

Când două reguli se contrazic („regula `p` zice albastru, regula `.menu` zice roșu"), decide **specificitatea**: cu cât țintirea este mai *precisă*, cu atât regula e mai puternică. O regulă care numește un element exact (`#id`) bate o regulă despre un grup (`.clasă`), care bate o regulă despre toate elementele de un tip (`p`).

```text
  slab ◀───────────────────────────────────────────▶ puternic

  element  <  .clasă  <  #id  <  style inline  <  !important
    p         .menu     #header                    (bomba nucleară)
```

💡 La egalitate, câștigă regula care apare **ultima** în fișier. (Nivelul cascadei: stil implicit browser → extern/intern → inline → `!important`.)

💡 Cuvântul *cascadă* din „Cascading Style Sheets" este exact asta: multe reguli curg peste pagină, iar conflictele se rezolvă prin specificitate.

### 📦 Box Model — diagrama pe care trebuie să o poți desena (subiect foarte probabil)

**Fiecare element din pagină este o cutie dreptunghiulară**, chiar și textul. Din interior spre exterior: **content → padding → border → margin**.

```text
┌─ margin (spațiu transparent ÎN AFARĂ) ────────┐
│  ┌─ border (marginea vizibilă) ────────────┐  │
│  │  ┌─ padding (spațiu ÎN INTERIORUL ─────┐│  │
│  │  │           border-ului)              ││  │
│  │  │     content (text, imagine)         ││  │
│  │  └─────────────────────────────────────┘│  │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

🧠 **Analogie — un tablou înrămat pe perete:**

| Strat | În analogie |
|---|---|
| **content** | fotografia |
| **padding** | passe-partout-ul alb dintre fotografie și ramă |
| **border** | rama |
| **margin** | peretele gol care ține celelalte tablouri la distanță |

🎯 **O singură propoziție:** *padding-ul împinge border-ul departe de conținut; margin-ul împinge celelalte elemente departe de border.* Padding-ul e în interior (primește culoarea de fundal), margin-ul e în exterior (mereu transparent).

```css
div {
  width: 300px;
  padding: 10px;       /* spațiu în interior, în jurul conținutului */
  border: 1px solid black;
  margin: 20px;        /* spațiu în exterior, între elemente */
  box-sizing: border-box; /* width include padding + border */
}
```

⚠️ **Capcana `box-sizing`:** implicit, `width: 300px` înseamnă că doar *conținutul* are 300px — padding-ul și border-ul **se adaugă deasupra** (total = width + 2×padding + 2×border), deci cutia iese mai lată decât ai cerut. `box-sizing: border-box` inversează sensul: „300px e totalul, încape totul în el." De aceea aproape orice proiect real îl setează global.

### display — cum se comportă o cutie față de vecini

| Valoare | Comportament | Exemple |
|---|---|---|
| `block` | 🍕 lacom: ocupă toată linia, împinge restul dedesubt | `div`, `p`, `h1` |
| `inline` | 🤏 modest: curge în text ca un cuvânt; **ignoră width/height** | `span`, `a`, `strong` |
| `inline-block` | 🔀 hibrid: stă în text ca un cuvânt, *dar* acceptă width/height | linkuri-buton |
| `none` | 👻 dispare complet, nu-și mai rezervă nici spațiul | — |
| `flex` / `grid` | 🧲 elementul devine *manager de layout* pentru copiii lui | grid mai jos |

## 1.3 CSS — unități, pseudo-clase, responsive (curs 04)

### Unitățile — întrebarea-cheie este „relativ la CE?" (învață acest tabel)

| Unitate | Tip | Relativ la |
|---|---|---|
| `px` | absolută | pixelul ecranului |
| `pt` | absolută | 1/72 inch (tipar/fonturi) |
| `%` | relativă | elementul **părinte** (`width: 50%` = jumătate din ce mă conține) |
| `em` | relativă | font-size-ul **părintelui** — ⚠️ **capcană: em-urile se înmulțesc în cascadă** (1.2em în 1.2em = 1.44×) |
| `rem` | relativă | font-size-ul **rădăcinii** (`html`) — referință fixă → fără înmulțire → predictibil; de aceea site-urile moderne îl preferă |
| `vw` / `vh` | relativă | 1% din lățimea/înălțimea ferestrei (`100vh` = exact cât fereastra de înalt) |

💡 **De ce contează unitățile relative:** un layout în `px` e înghețat; un layout în `rem`/`%`/`vw` se scalează când utilizatorul schimbă ecranul sau mărește textul — exact scopul design-ului responsive.

### Pseudo-clasele — stilizezi STĂRI, nu elemente

O pseudo-clasă selectează un element **doar cât timp este într-o anumită stare**. Elementul e același; situația lui se schimbă. Cele două puncte se citesc natural: `a:hover` = „un link, *când e sub mouse*".

```css
a:hover { color: red; }        /* mouse-ul e deasupra acum */
a:active { ... }               /* în timp ce e apăsat */
input:focus { ... }            /* are focus de tastatură (cursorul e în input) */
input:checked { ... }          /* checkbox/radio bifat */
input:disabled { ... }
tr:nth-child(even) { background: #eee; }  /* stare pozițională → tabele zebră */
```

### Transition & transform — funcționează în pereche

| | Rol | Fără perechea sa |
|---|---|---|
| **transform** | 🏁 destinația: ce pățește elementul — rotire, scalare, mutare (`translate`), înclinare (`skew`) | schimbarea e instantanee |
| **transition** | 🛣️ călătoria: *cum* se întâmplă schimbarea în timp — „când o proprietate se schimbă, animeaz-o în 0.5s în loc să sară" | nu are ce anima |

🎯 **Rețeta:** `transition` pe starea de bază, noul `transform` pe starea `:hover`. Hover → transform-ul se schimbă → transition-ul animează lin.

```css
.card {
  transition: transform 0.5s ease;
}
.card:hover {
  transform: rotate(10deg) scale(1.2) translateX(20px);
}
```

### 📱 Responsive design — o pagină, orice ecran (demo-ul „responsive.css" din curs — răspuns scris excelent)

**Problema:** aceeași pagină e văzută pe un telefon de 360px și pe un monitor de 1920px.
**Soluția:** pagina **detectează spațiul disponibil și se rearanjează singură**.

🎯 **Setul de unelte (numește toate patru într-un răspuns):**

1. **Meta tag-ul viewport** — fără el, telefoanele se prefac că sunt desktopuri de 980px și micșorează pagina ca să încapă. Tag-ul spune „folosește lățimea ta reală" — de aceea e obligatoriu:
   `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
2. **Unități relative** (vezi mai sus).
3. **Media queries** — un *if pentru CSS*: `@media (min-width: 768px) { ... }` = „aplică aceste reguli extra doar când fereastra are cel puțin 768px lățime."
4. **Grid / Flexbox** — sisteme de layout care distribuie spațiul.

💡 **Strategia mobile-first:** scrii layout-ul simplu, pe o coloană, ca implicit, apoi folosești media queries cu `min-width` ca să *adaugi* complexitate pentru ecrane mai mari. Motivul: telefonul e dispozitivul limitat; pornești simplu și îmbogățești.

💡 **CSS Grid în două propoziții:** părintele declară `display: grid` și definește coloanele cu `grid-template-columns` (ex. `220px 1fr 220px` = sidebar fix, mijloc flexibil, sidebar fix — `1fr` = „o parte din spațiul rămas"). Copiii își revendică celule: `grid-column: 1 / 4` = „întinde-te de la linia 1 la linia 4 a gridului", adică peste toate cele 3 coloane — exact ce vor un header și un footer.

```text
   MOBIL (< 768px)              LAPTOP (≥ 768px)
  ┌──────────────┐         ┌─────────────────────────┐
  │    header    │         │         header          │  ← grid-column: 1/4
  ├──────────────┤         ├──────┬──────────┬───────┤
  │     nav      │         │ nav  │   main   │ aside │
  ├──────────────┤         │220px │   1fr    │ 220px │
  │     main     │         ├──────┴──────────┴───────┤
  ├──────────────┤         │         footer          │  ← grid-column: 1/4
  │    aside     │         └─────────────────────────┘
  ├──────────────┤
  │    footer    │
  └──────────────┘
   1 coloană (1fr)
```

```css
/* Mobile first: o coloană */
body {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
}

/* Laptop: 3 coloane când fereastra are cel puțin 768px */
@media (min-width: 768px) {
  body {
    grid-template-columns: 220px 1fr 220px;
    grid-template-rows: 90px 1fr 80px;
  }
  header { grid-column: 1 / 4; }   /* se întinde peste toate 3 coloanele */
  nav    { grid-column: 1; }
  main   { grid-column: 2; }
  aside  { grid-column: 3; }
  footer { grid-column: 1 / 4; }
}
```

🎯 **Demo-ul ca poveste:** *pe mobil totul se stivuiește pe o coloană; de la 768px în sus, pagina devine un grid cu 3 coloane în care header-ul și footer-ul se întind pe toată lățimea, iar nav/main/aside ocupă câte o coloană.*

---

# 🌐 PARTEA 2 — SERVER (2 întrebări)

## 2.1 Fundamentele web-ului (cursurile 01, 08)

**Modelul client–server este o conversație cu roluri stricte:** clientul (browserul tău) mereu *întreabă*, serverul mereu *răspunde*. Serverul nu începe niciodată conversația. O întrebare = un **request**, un răspuns = un **response**. Ăsta e tot web-ul: miliarde de astfel de schimburi.

```text
   CLIENT (browser)                        SERVER
  ┌──────────────┐    ── REQUEST ──▶     ┌──────────────┐
  │   întreabă   │    GET /heroes        │   răspunde   │
  │   (mereu el  │                       │  (niciodată  │
  │   primul)    │    ◀── RESPONSE ──    │   primul)    │
  └──────────────┘   status+headere+body └──────────────┘
```

Un răspuns are întotdeauna trei părți:

| Parte | Ce este |
|---|---|
| **status code** | un număr care rezumă cum a mers |
| **headere** | metadate („asta e HTML", „setează acest cookie") |
| **body** | conținutul propriu-zis |

💡 **Mașină-server vs aplicație-server** — cuvântul „server" e supraîncărcat: *mașina* e calculatorul fizic; *aplicația* (nginx, Apache, IIS, aplicația ta Express) e programul care rulează pe el și răspunde la HTTP. O mașină poate rula mai multe aplicații-server pe **porturi** diferite.

🧠 **Portul e ca numărul apartamentului:** adresa IP te duce la bloc, portul te duce la ușa potrivită. `localhost` (= `127.0.0.1`) înseamnă „chiar acest calculator." Deci `localhost:8080` = „aplicația care ascultă la ușa 8080 de pe propria mea mașină."

**Istorie-cheie (curs 01):**

| An | Invenție | Autor |
|---|---|---|
| 1973 | TCP/IP | Kahn & Cerf |
| 1983 | DNS | Mockapetris |
| 1989 | WWW, HTTP, HTML | Tim Berners-Lee (CERN) |
| 1994 | PHP | Lerdorf |
| 1995 | JavaScript | Brendan Eich |
| 1995 | Apache | McCool |
| 1995 | MySQL | Widenius & Axmark |
| 1996 | CSS | Lie & Bos |

### 🎯 Trei moduri de a încărca o pagină web (cursul 08, material de examen aproape cuvânt cu cuvânt)

1. **Protocolul `file://`** — browserul deschide fișierul direct de pe disc; niciun server implicat. Merge pentru o pagină-jucărie; se strică imediat ce ai nevoie de requesturi, baze de date sau orice dinamic.
2. **Un server web existent** — altcineva a scris programul-server; tu doar îl îndrepți spre fișierele tale: Live Server din VS Code (localhost:5500) sau cele profesionale — **Nginx, Apache, Microsoft IIS**.
3. **Un server web scris de tine** — necesar din momentul în care vrei *logică* (să calculezi, să vorbești cu o bază de date, să verifici login-uri). În Node.js, cel mai popular pachet este **Express**.

### 🎯 Trei moduri de a face requesturi

1. **Bara de adrese a browserului** — cel mai simplu, dar limitat: doar GET, ascunde status codes și headere.
2. **Clienți GUI** — Postman/RestMan: orice metodă, vizibilitate completă.
3. **CLI** — `curl "http://localhost:8080" -X GET`, scriptabil.

### Verbele HTTP — intenția requestului

URL-ul spune *despre ce lucru* vorbești; **verbul** spune *ce vrei să i se facă*. Asta se mapează 1:1 pe **CRUD** (Create, Read, Update, Delete) — un API proiectat așa se numește **REST**.

| Verb | CRUD | Exemplu din curs |
|---|---|---|
| GET | 📖 read | `GET /heroes` → lista |
| POST | ➕ create | `POST /heroes?name=Tony` |
| PUT | ✏️ update | `PUT /heroes?oldName=John&newName=Tony` |
| DELETE | 🗑️ delete | `DELETE /heroes?name=John` |

### Status codes — verdictul serverului într-un singur număr

Prima cifră e categoria — atât îți trebuie ca să raționezi despre ele:

| Categorie | Înseamnă | Exemple |
|---|---|---|
| **2xx** | ✅ succes | `200` OK (poftim datele), `201` Created (POST-ul a mers, lucrul există acum) |
| **4xx** | 👤 vina TA, clientule | `400` Bad Request (parametri invalizi), `404` Not Found |
| **5xx** | 🔥 vina MEA, serverul | `500` Internal Server Error (am crăpat), `501` Not Implemented |

🧠 **Truc de memorare: 4 = tu, 5 = eu (serverul).**

### SSR vs CSR — unde se asamblează HTML-ul?

Întrebarea la care răspund ambii termeni: *cine transformă datele în HTML?*

| | SSR (Server-Side Rendering) | CSR (Client-Side Rendering) |
|---|---|---|
| Cine construiește HTML-ul | **serverul** | **JavaScript-ul din browser** |
| Ce trimite serverul | pagina HTML gata făcută | date brute (**JSON**) printr-un API |
| Unealta | motor de template (**EJS**, PUG) — HTML cu găuri `<%= %>` în care se toarnă datele | `fetch` + manipulare DOM |
| 🧠 Analogie | 🍽️ restaurant: primești mâncarea gătită | 🥡 meal kit: primești ingredientele și gătești acasă |
| Avantaj | conținut vizibil mai repede la prima încărcare, prietenos cu SEO | pagina se simte ca o aplicație (se actualizează fără reîncărcare completă) |
| Dezavantaj | fiecare schimbare = pagină nouă de la server | nu apare nimic până nu rulează JS-ul |

## 2.2 Node.js, npm, Express (cursurile 07–08)

Clarifică rolurile și restul curge de la sine:

| Unealtă | Rol | Esențial |
|---|---|---|
| **Node.js** | ⚙️ motorul | JS trăia doar în browsere; Node e un *runtime* care execută JS **pe mașina/serverul tău**, cu puteri pe care browserul nu le dă (citit fișiere prin `fs`, deschis porturi de rețea). Rulezi inline (REPL) sau din fișier: `node server.js`. Utile: `process.version`, `process.cwd()`, `process.argv`, `process.exit()` |
| **npm** | 📦 managerul de pachete | un „app store" pentru biblioteci de cod. `npm init -y` creează `package.json` (manifestul proiectului: nume, dependențe); `npm i express` descarcă Express în `node_modules` și îl notează ca dependență |
| **Express** | 🛣️ biblioteca de server | Node *poate* face HTTP și singur, dar Express îți dă stilul curat „când vine un GET pe /sum, rulează această funcție" |
| **nodemon** | 🔄 confortul | îți urmărește fișierele și repornește serverul la fiecare salvare (`nodemon server.js`), ca să nu mai dai manual Ctrl+C și restart |

### Anatomia oricărui server Express

🎯 **Trei pași, mereu aceiași:**

```text
  1️⃣ creezi aplicația          const server = express();
  2️⃣ declari ce face           server.use(...) / server.get(...)
     pentru ce requesturi
  3️⃣ asculți pe un port        server.listen(8080, ...)
     („deschide ușa 8080 și așteaptă")
```

Un **server static** este versiunea minimă — o singură linie de middleware care înseamnă „dacă requestul se potrivește cu un fișier din `public`, trimite-l pur și simplu." Fără logică.

```js
const express = require("express");
const server = express();
const PORT = 8080;

server.use(express.static("public"));   // servește fișierele din /public

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

💡 Acces: `http://localhost:8080/index.html` — `index.html` e fișierul implicit prin convenție, deci `/` îl servește automat. Un coleg din aceeași rețea poate folosi `http://IP-UL_TĂU:8080`.

### Rutele — „când sosește X, rulează această funcție"

`app.get("/sum", (req, res) => {...})` se citește: „**când** sosește un request GET la /sum, **rulează** această funcție, dându-i `req` (tot ce ține de cererea primită) și `res` (uneltele de răspuns)."

- `req.query` — query string-ul parsat. URL-ul `/sum?a=1&b=2` → `req.query.a === "1"`.
  ⚠️ **Tot ce vine dintr-un URL e string** — de aceea codul îl trece prin `Number(...)` și apoi verifică `isNaN`.
- `res.status(...)` — alegi numărul-verdict; `res.send(...)` / `res.json(...)` — trimiți corpul (text vs JSON).

🎯 Exercițiul `GET /sum` e doar șablonul: *citește intrările din `req.query` → validează → 400 dacă-s rele, 200 + rezultat dacă-s bune.*

```js
app.get("/sum", (req, res) => {
  const a = Number(req.query.a);     // datele sosesc în QUERY STRING:
  const b = Number(req.query.b);     // http://localhost:8080/sum?a=1&b=2
  if (isNaN(a) || isNaN(b)) {
    res.status(400).send("invalid operands");
  } else {
    res.status(200).send(`${a + b}`);
  }
});
```

### API-ul REST cu eroi — același șablon × 4 verbe (curs 08, în memorie)

Un array în memorie plus rutele CRUD. Fiecare rută urmează aceeași micro-rețetă:

```text
  citește parametrul din req.query
        │
        ▼
  lipsește? ──── DA ──▶ 400 + mesaj de eroare
        │
        NU
        ▼
  operația pe array (push / filter / înlocuire)
        │
        ▼
  răspunde cu codul potrivit (201 pentru creat, 200 altfel)
```

Singurul ingredient nou este **`cors()`**. Browserul are o regulă de siguranță: o pagină încărcată de pe un *origin* (ex. `localhost:5500`) **nu are voie** să facă fetch de pe alt origin (ex. `localhost:8081`) decât dacă acel server îi dă voie explicit. Middleware-ul `cors` adaugă header-ul „da, ai voie."

⚠️ Fără el, browserul îți blochează fetch-ul — clasicul mister „merge în Postman, dar nu merge în browser."

```js
const express = require("express");
const cors = require("cors");
const server = express();
let heroes = ["John", "Peter"];

server.use(cors());   // permite requesturi de pe alte origini (front-end pe alt port)

server.get("/heroes", (req, res) => res.status(200).json(heroes));

server.post("/heroes", (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({error: "Name query param is required"});
  heroes.push(name);
  res.status(201).json({message: "Hero added", heroes});
});

server.delete("/heroes", (req, res) => {
  const {name} = req.query;
  if (!name) return res.status(400).json({error: "Name query param is required"});
  heroes = heroes.filter(h => h !== name);
  res.json({message: "Deleted", heroes});
});

server.listen(8081, () => console.log("API server running"));
```

### fetch — capătul dinspre client al țevii (curs 08)

`fetch(url)` este modul în care JS-ul din browser face propriile requesturi HTTP (în loc ca utilizatorul să navigheze). Două `await`-uri, întotdeauna, și sunt *pași diferiți*:

```text
  1️⃣ await fetch(...)          ──▶ aștepți să SOSEASCĂ răspunsul (status, headere)
  2️⃣ await response.json()     ──▶ aștepți să fie CITIT și PARSAT body-ul
```

Apoi cod DOM obișnuit pictează datele în pagină. 💡 Această buclă fetch-apoi-randează **este** CSR în practică — leagă aceste puncte într-un răspuns de examen.

```js
async function loadHeroes() {
  const response = await fetch("http://localhost:8081/heroes");
  const heroes = await response.json();
  heroesList.innerHTML = "";
  heroes.forEach(hero => {
    const li = document.createElement("li");
    li.textContent = hero;
    heroesList.appendChild(li);
  });
}

await fetch(`http://localhost:8081/heroes?name=${name}`, {method: "POST"});
```

## 2.3 ⚡ JavaScript asincron — callbacks, Promises, async/await (curs 09)

> 🔴 **SUBIECTUL clasic de examen al acestui curs.** Trebuie să poți reproduce versiunea greșită, versiunea corectă și să explici *de ce*.

### Problema, de la zero

JavaScript rulează **un singur lucru o dată** (single-threaded). Dacă pur și simplu ar *aștepta* 3 secunde după un timer, un fișier sau o bază de date, totul ar îngheța. În schimb, operațiile lente funcționează ca un pager de restaurant: ceri lucrarea, JS **merge mai departe imediat**, iar funcția ta **callback** e apelată mai târziu, când rezultatul e gata.

💡 **Asincron = „pornește acum, termină mai târziu, nu bloca între timp."**

### De ce versiunea naivă e stricată (trebuie să poți explica exact asta)

**Versiunea greșită:**

```js
function computeSumWithDelay(a, b, delay) {
  setTimeout(() => {
    if (isNaN(a) || isNaN(b)) {
      throw new Error(`Not a number`);
    }
    return a + b;          // ⚠️ returnează din CALLBACK, nu din computeSumWithDelay
  }, delay);
}
```

**Urmărește cronologia:**

```text
  TIMP ──────────────────────────────────────────────────────▶

  computeSumWithDelay(1, 2, 1000) rulează
     │
     ├── dă callback-ul lui setTimeout („cheamă-l mai târziu")
     │
     └── se TERMINĂ imediat, fără return propriu
              │
              ▼
        apelantul primește undefined, CHIAR ACUM ❌

        ... 1 secundă mai târziu ...

  timerul sună → callback-ul rulează
     │
     └── return-ul lui iese din CALLBACK (altă funcție!),
         în mașinăria timerului, unde nu ascultă nimeni.
         Valoarea se evaporă. ❌
```

Aceeași poveste pentru erori: un `throw` din callback se întâmplă mult după ce `try/catch`-ul apelantului s-a închis. Nu mai e nimeni acolo să-l prindă.

🎯 **Rezumat într-o propoziție:** *`return` și `throw` călătoresc doar prin stiva de apeluri activă în acel moment; când callback-ul asincron rulează, stiva apelantului original a dispărut de mult.*

### Rezolvarea — Promise-ul, explicat ca obiect

Un **Promise** este un obiect-substituent pentru o valoare care *încă* nu există — 🎟️ un bon de la curățătorie. Primești bonul imediat; hainele vin mai târziu. Bonul se încheie în exact două feluri:

| Stare | Înseamnă | Echivalentul sincron |
|---|---|---|
| **resolved** | ✅ succes, poftim valoarea | `resolve(x)` ↔ `return x` |
| **rejected** | ❌ eșec, poftim eroarea | `reject(err)` ↔ `throw err` |

🎯 **Rezolvarea e mecanică:** împachetezi lucrarea asincronă în `return new Promise((resolve, reject) => {...})`, iar în callback înlocuiești `return` → `resolve`, `throw` → `reject`. Acum funcția returnează *ceva util imediat* — bonul.

### async/await — face bonul lizibil

- `await unPromise` = „pune pe pauză **această funcție** (nu tot programul!) până se răscumpără bonul, apoi dă-mi valoarea."
- Un promise respins la un `await` se comportă ca o eroare aruncată — de aceea `try/catch`-ul obișnuit funcționează din nou.
- `async` în fața funcției e doar permisul necesar ca să poți folosi `await` înăuntru.

**Versiunea corectă:**

```js
function computeSumWithDelay(a, b, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isNaN(a) || isNaN(b)) {
        reject(new Error(`Not a number`));   // reject înlocuiește throw
      }
      resolve(a + b);                        // resolve înlocuiește return
    }, delay);
  });
}

async function main() {            // async → permite await înăuntru
  try {
    const sum = await computeSumWithDelay(1, 2, 1000);  // await = așteaptă rezultatul
    console.log(sum);
  } catch (error) {
    console.log(error.message);    // reject aterizează în catch
  }
}
main();
```

🧠 **Simetria de reținut:**

| Lumea sincronă | Lumea asincronă |
| --- | --- |
| `return valoare` | `resolve(valoare)` |
| `throw eroare` | `reject(eroare)` |
| apelezi funcția | `await` pe funcție |
| `try/catch` | `try/catch` în jurul lui `await` |

🎯 **Regulile de scris pe foaie:**
1. O funcție care primește un callback este asincronă.
2. Împachetează lucrarea asincronă în `new Promise((resolve, reject) => ...)`.
3. În interiorul promise-ului: `resolve` în loc de `return`, `reject` în loc de `throw`.
4. Apelantul trebuie să fie `async` și să folosească `await`; erorile se prind cu `try/catch`.

💡 async/await îți dă înapoi *stilul* codului sincron fără *înghețarea* codului sincron. Ăsta e tot scopul lui.

## 2.4 🗄️ MySQL din Node.js — același șablon, aplicat (curs 09)

**Distribuția rolurilor:** serverul MySQL e propriul lui program, ascultând pe propriul port (**3306**, așa cum Express ascultă pe 8080). Clienți care pot vorbi cu el:

```text
                       ┌──────────────────────┐
  mysql CLI ─────────▶ │                      │
  (mysql -u root -p)   │   SERVER MySQL       │
  DBeaver (GUI) ─────▶ │   portul 3306        │
                       │                      │
  programul tău Node ▶ │   (pachetul mysql    │
  (scopul cursului)    │    din npm)          │
                       └──────────────────────┘
```

**SQL de bază:** `SHOW DATABASES;` · `USE first_db;` · `SHOW TABLES;` · `SELECT * FROM student;` · `INSERT INTO student VALUES ('Dave', '10');`

### Connection pooling — de ce există

Deschiderea unei conexiuni la baza de date e scumpă (handshake de rețea, autentificare). S-o faci pentru *fiecare* request HTTP e ca și cum ai angaja și concedia un curier pentru fiecare scrisoare în parte.

🧠 Un **pool** ține o echipă mică de curieri (ex. `connectionLimit: 10`) angajați permanent: un query ia o conexiune liberă, o folosește, o dă înapoi.

🎯 **Rezultatul (justificarea completă pentru un răspuns):** requesturi mai rapide și o limită fermă de conexiuni simultane, astfel încât baza de date să nu fie copleșită pe măsură ce traficul crește.

### runQuery — recunoaște-l, nu-l memora

`pool.query(sql, params, callback)` e în stil callback — aceeași „lume veche" ca `setTimeout` din 2.3. Cursul îl împachetează într-un Promise cu exact rețeta pe care o știi deja.

💡 **`runQuery` nu e materie nouă — e șablonul din secțiunea 2.3 aplicat unei baze de date.**

```js
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "sa",
  database: "first_db",
});

// query promisificat (același șablon ca în 2.3!)
function runQuery(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}

async function main() {
  try {
    const result = await runQuery(`SELECT * FROM student`);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
```

Varianta modernă (`mysql2/promise`) vine cu promises încorporate, deci wrapper-ul nu mai e necesar. Semnele `?` sunt **query-uri parametrizate** — ține minte ideea, sunt vedeta secțiunii despre SQL injection.

```js
const mysql = require("mysql2/promise");
const connection = await mysql.createConnection(dbConfig);
const [rows] = await connection.query("SELECT name FROM heroes");
await connection.query("INSERT INTO heroes (name) VALUES (?)", [name]);  // parametrizat!
const [result] = await connection.query("UPDATE heroes SET name = ? WHERE name = ?", [newName, oldName]);
// result.affectedRows === 0 → nimic nu s-a potrivit → răspunde 404
```

## 2.5 🔐 Securitate (curs 10) — întrebare de server foarte probabilă

Securitatea e cel mai *narativ* subiect: fiecare vulnerabilitate e o poveste cu un atac și o apărare. Învață poveștile; codul vine de la sine.

### 📖 Povestea 1: Stocarea parolelor (hashing)

⚠️ **Niciodată nu stoca parolele ca atare.** Bazele de date se fură — și când se întâmplă, fiecare parolă în clar e compromisă instantaneu (inclusiv pe alte site-uri unde oamenii au refolosit-o).

**Hashing** = transformarea unui string de lungime variabilă într-o amprentă de lungime fixă.

🎯 **Patru proprietăți fac o funcție de hash (memorează-le ca listă):**

1. **deterministă** — aceeași intrare, aceeași ieșire, mereu (necesar ca login-ul să poată re-hash-ui și compara);
2. **rapidă** de calculat;
3. **imposibil practic de inversat** — amprentă → parolă nu se poate (tot rostul: o stradă cu sens unic);
4. **rezistentă la coliziuni** — două intrări practic niciodată nu au aceeași amprentă.

💡 Login-ul nu compară niciodată parole — compară amprente: hash-uiește ce a tastat utilizatorul și verifică împotriva hash-ului stocat.

**Istorie:** MD5 (128 biți, 1991) e spart — nu-l folosi; SHA-256 (256 biți, 2001) / SHA-512 (512 biți) sunt standardele moderne (numărul = dimensiunea ieșirii în biți).

**⚔️ Atacuri asupra hash-urilor** — atacatorul nu le poate inversa, așa că *ghicește înainte*:

| Atac | Cum funcționează |
|---|---|
| **Dicționar** | hash-uiește o listă de parole probabile („123456", fiecare cuvânt din dicționar) și caută amprente identice |
| **Brute force** | hash-uiește *fiecare combinație posibilă* de caractere. Garantat reușește cândva; întrebarea e doar cât durează |
| **Rainbow tables** | un tabel uriaș precalculat de perechi parolă→hash; spargerea devine o simplă căutare. Schimbă spațiu pe disc contra timp |

**🛡️ Apărări, fiecare țintită pe un atac anume:**

| Apărare | Ce este | Ce învinge |
|---|---|---|
| **Salt** 🧂 | string aleator, *unic per utilizator*, concatenat la parolă înainte de hash; stocat în clar lângă hash. Parole identice → hash-uri diferite. Puterea lui nu e secretul, ci **unicitatea** | rainbow tables (ar trebui câte un tabel *per salt*) |
| **Pepper** 🌶️ | ca un salt, dar *același pentru toți* și **ținut secret**, departe de baza de date (în configurația aplicației). Chiar cu toată baza furată, atacatorului îi lipsește un ingredient | furtul bazei de date |
| **Key stretching** 🔁 | rulezi hash-ul de mii de ori în buclă. Un login real abia simte milisecundele; un atacator care face miliarde de încercări le simte pe toate. (Sabotează intenționat proprietatea #2 pentru atacatori) | brute force |
| **Nivel uman** 👤 | parole puternice obligatorii, limitarea încercărilor de login (blocare cont) | ghicirea directă |

💡 **bcrypt** = toate cele de mai sus într-un singur pachet: generează automat un salt unic și are un **cost/work factor** configurabil (key stretching — cost 12 = 2¹² runde).

**Anatomia unui hash bcrypt:**

```text
$2b$12$KIXI/JhO7jWgBvijUvNzbu5q3lXeBGaXQ5xGxyupj1tB5mBns7k1W
 ─┬ ─┬ └─────────┬──────────┘└────────────┬─────────────────┘
  │  │     salt (22 caractere,      hash-ul propriu-zis
  │  │     base64) — stocat         (base64)
  │  │     LA VEDERE în string!
  │  └── cost factor: 2¹² runde de hash
  └── versiunea bcrypt
```

💡 Observă că salt-ul e *în interiorul* string-ului stocat — așa poate login-ul să refacă exact același calcul.

### 📖 Povestea 2: XSS — Cross-Site Scripting

**Ideea:** un site afișează conținut tastat de *utilizatori*. Dacă site-ul inserează acel conținut în pagină ca HTML brut, un utilizator care tastează *HTML/JavaScript* obține **executarea codului său în browserul fiecărui alt vizitator** — fură cookie-uri/sesiuni sau redirecționează.

**Stored XSS** = payload-ul e salvat pe server (în baza de date), deci fiecare vizitator viitor îl declanșează.

**Vectorul din curs:** adaugi un erou pe nume `<img src onerror='alert("hacked")'>`.

```text
  atacatorul salvează „eroul":  <img src onerror='alert("hacked")'>
        │
        ▼  (ajunge în baza de date)
  pagina afișează lista cu innerHTML
        │
        ▼
  browserul PARSEAZĂ string-ul ca un tag <img> real
        │
        ▼
  imaginea nu se încarcă → onerror rulează JS-ul atacatorului 💥
```

🎯 **Rezolvarea închide confuzia dintre *date* și *cod*:** înainte să inserezi text de la utilizator în pagină, **escapează-l** — transformă caracterele speciale HTML în entități (îți amintești entitățile din 1.1? De aceea există). După escapare, browserul *afișează* `<img ...>` ca text inofensiv în loc să-l *execute*. (Rezolvare echivalentă: `innerText` în loc de `innerHTML`, care nu parsează niciodată HTML.)

```js
function escapeHtml(str) {
  return str.toString()
    .replace("&", "&amp;")
    .replace("<", "&lt;")
    .replace(">", "&gt;")
    .replace('"', "&quot;")
    .replace("'", "&#039;");
}
htmlHeroItem.innerHTML = escapeHtml(`${hero.name} ${hero.level}`);
```

### 📖 Povestea 3: SQL Injection

💡 **Aceeași boală, alt organ.** XSS = input de utilizator confundat cu HTML de către *browser*. SQL injection = input de utilizator confundat cu SQL de către *baza de date*.

Obiceiul vulnerabil e construirea query-urilor prin lipire de string-uri — textul utilizatorului e lipit *în interiorul* comenzii SQL, deci un utilizator care tastează un apostrof poate **închide string-ul devreme și continua să scrie SQL**:

```js
sql = `SELECT name, level FROM heroes WHERE name='${textToSearch}';`;
```

**🎬 Escaladarea din curs, ca o poveste (fiecare pas învață ceva):**

| Pas | Vector de atac | Ce obține atacatorul |
|---|---|---|
| 1️⃣ | `' OR '1=1` | WHERE devine `name='' OR '1=1'` — adevărat pentru fiecare rând → **toată tabela**. Dovada că gaura există |
| 2️⃣ | `' order by 1; %23` | sondează **câte coloane** întoarce query-ul. (`%23` = `#` codificat în URL, care începe un comentariu SQL — **neutralizează restul query-ului original** ca injecția să nu strice sintaxa) |
| 3️⃣ | `' union select version(),database(); %23` | `UNION` sudează SELECT-ul atacatorului pe rezultat → scurge **versiunea DB + numele bazei** |
| 4️⃣ | `' union select TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA="first_db"; %23` | catalogul propriu al bazei de date cu fiecare tabelă și coloană → atacatorul are acum **harta** |
| 5️⃣ | `' union select name, password FROM heroes; %23` | folosește harta ca să fure credențialele. **Game over** 💀 |

**🛡️ Rezolvări, în ordinea calității:**

```js
// bine: escapare — sanitizează apostrofurile, dar trebuie să ții minte s-o aplici peste tot
sql = `SELECT name, level FROM heroes WHERE name=${mysql.escape(textToSearch)};`;

// mai bine: QUERY-URI PARAMETRIZATE — răspunsul adevărat
sql = `SELECT name, level FROM heroes WHERE name=?;`;
const result = await runQuery(sql, [textToSearch]);
```

🎯 Cu placeholder-ele `?`, baza de date primește *comanda* și *datele* pe canale separate, deci inputul utilizatorului **nu e niciodată interpretat ca SQL, indiferent ce conține**.

> 💡 **Tema unificatoare a tuturor celor trei povești: *ține datele și codul separate.***

## 2.6 🍪 Cookies, sesiuni, autentificare (curs 13)

**Problema:** HTTP este **stateless (fără memorie)** — fiecare request e o conversație nou-nouță; serverul nu are nicio memorie încorporată despre cine ești. Te loghezi, apoi faci alt request: serverul, implicit, te-a uitat deja.

### Cookie-urile — bilețelele lipite de server pe client

Un cookie e o mică pereche cheie/valoare cu un ciclu de viață special:

```text
  1️⃣ SERVERUL îl setează într-un răspuns          „ține asta la tine"
         │   Set-Cookie: cheie=valoare
         ▼
  2️⃣ BROWSERUL îl stochează și — partea crucială —
     îl ATAȘEAZĂ AUTOMAT la fiecare request viitor
     către același server
         │   Cookie: cheie=valoare  (automat!)
         ▼
  3️⃣ SERVERUL îl regăsește la fiecare request      req.cookies
```

🧠 **Analogie:** ștampila pe mână la club: serverul te ștampilează o dată; tu arăți ștampila automat la fiecare ușă.

Cookie-urile expiră (`maxAge`), pot fi șterse (`clearCookie`) și se pot inspecta în DevTools → Application → Storage → Cookies.

```js
const cookieParser = require("cookie-parser");
server.use(cookieParser());                    // middleware: parsează header-ul Cookie → req.cookies

res.cookie("cookie-key-a", "cookie-value-a", {maxAge: 120 * 1000}); // setează, expiră în 120 s
console.log(req.cookies);                       // citește ce a trimis clientul
res.clearCookie("cookie-key-a");                // șterge
```

### Sesiunile — memorie făcută corect

⚠️ Ai *putea* stoca „loggedIn=true, user=ana" direct în cookie-uri — dar clientul își poate edita propriile cookie-uri. Oricine ar putea falsifica „loggedIn=true."

**Sesiunile împart stocarea în două:**

```text
   BROWSER (client)                    SERVER
  ┌─────────────────┐               ┌──────────────────────────┐
  │ cookie:         │               │ cutia #x7Kf9q2:          │
  │ connect.sid =   │ ──── doar ──▶ │   user: "ana"            │
  │   "x7Kf9q2"     │   numărul     │   isLoggedIn: true       │
  │                 │   cutiei      │   (datele REALE stau     │
  │ (doar un număr  │               │    AICI, pe server)      │
  │  fără sens)     │               │                          │
  └─────────────────┘               └──────────────────────────┘
```

Toate datele reale trăiesc **pe server**, într-un tabel de cutii per-utilizator. Cookie-ul browserului ține doar **numărul cutiei** — un session-id lung și aleator (cookie-ul `connect.sid`), semnat cu `secret`-ul serverului ca să nu poată fi falsificat sau ghicit.

🧠 **Analogie cu hotelul:** sesiunea e camera ta (lucrurile tale sunt în ea, pe proprietatea serverului); cookie-ul e cardul de acces (un număr fără sens care deschide acea singură cameră). Să furi numărul cardului nu-ți spune nimic despre conținut; nu poți fabrica un card valid.

💡 `express-session` face totul transparent: `req.session` *este* cutia ta — scrii `req.session.user = "ana"` și persistă pe toate requesturile acelui utilizator.

### 🎯 Fluxul de autentificare — povestea de spus pe foaie

```text
  BROWSER                                      SERVER
     │                                            │
     │ 1️⃣ POST /login  {user, pass} în BODY       │
     │ ──────────────────────────────────────────▶│ 2️⃣ validează (hash bcrypt — leagă de 2.5)
     │                                            │ 3️⃣ scrie în sesiune:
     │                                            │    req.session.isLoggedIn = true
     │ ◀────── 4️⃣ Set-Cookie: connect.sid ────────│
     │                                            │
     │ 5️⃣ GET /student  + cookie-ul AUTOMAT       │
     │ ──────────────────────────────────────────▶│ găsește cutia → știe cine întreabă
     │                                            │ 6️⃣ rută protejată:
     │ ◀───────── acces permis / refuzat ─────────│    if (req.session.isLoggedIn) ...
     │                                            │
     │ 7️⃣ POST /logout                            │
     │ ──────────────────────────────────────────▶│ req.session.destroy() (arde cutia)
     │ ◀──────────── clearCookie ─────────────────│ + ia înapoi cardul de acces
```

1. **Login:** clientul trimite credențialele prin POST, **în corpul cererii** (niciodată în URL — URL-urile ajung în loguri și istoric; de aceea e POST + `req.body`, care are nevoie de middleware-ul `express.json()` ca să fie parsat).
2. Serverul **validează** (împotriva hash-urilor bcrypt — se leagă de secțiunea 2.5).
3. Valid → serverul scrie în sesiune: `req.session.isLoggedIn = true`, `req.session.user = ...`.
4. Răspunsul duce **cookie-ul cu session-id** la browser.
5. Fiecare request ulterior **poartă automat** cookie-ul → serverul găsește cutia → știe cine întreabă.
6. **Rutele protejate** doar verifică cutia: `if (req.session.isLoggedIn) ... else refuză`.
7. **Logout** = `req.session.destroy()` (arde cutia) + `clearCookie` (ia înapoi cardul).

```js
const session = require("express-session");

app.use(express.static("public"));
app.use(express.json());                 // parsează body-urile JSON → req.body
app.use(session({
  secret: "secret-key",                  // semnează cookie-ul de sesiune
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1200000},
}));

app.post("/login", (req, res) => {
  req.session.isLoggedIn = false;
  const {user, pass} = req.body;         // credențialele în BODY (POST), nu în URL
  if (isValid(user, pass)) {
    req.session.user = user;             // creează sesiunea
    req.session.isLoggedIn = true;
    res.send("Login successful");
  } else {
    res.send("Login failed");
  }
});

app.get("/student", (req, res) => {      // rută protejată
  if (req.session.isLoggedIn) res.send("GET on /student granted");
  else res.send("You are not granted to access GET on /student.");
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.send("Logout successful");
  });
});
```

💡 Fiecare linie din acest cod e un pas din povestea de mai sus.

---

# 🧩 PARTEA 3 — Alte subiecte (probabilitate mică, parcurge-le rapid)

## Web Components — vanilla (curs 11)

Modul nativ al browserului de a-ți defini *propriul* tag HTML. O clasă extinde `HTMLElement` și e înregistrată cu `customElements.define("attribute-counter", AttributeCounter)` — liniuța din nume e obligatorie; așa distinge browserul tagurile custom de cele native.

- **Shadow DOM**: `this.attachShadow({mode: "closed"})` dă componentei un mini-document privat, sigilat — CSS-ul paginii nu poate intra, CSS-ul componentei nu poate ieși (încapsulare).
- Callback-urile de ciclu de viață sunt doar „browserul te anunță": `constructor()` (creat) → `connectedCallback()` (inserat în pagină) → `attributeChangedCallback(name, old, new)` pentru atributele listate în `static get observedAttributes()`.
- Câmpuri private de clasă cu `#value`; getterii/setterii declanșează re-randarea.

## Web Components — Lit (curs 12)

O bibliotecă mică peste același standard, care elimină munca manuală.

- Clasa extinde `LitElement`; `static properties = {value: {}}` → **proprietăți reactive**: schimbi o valoare → componenta se re-randează singură, fără apeluri manuale de render.
- `render()` returnează un template declarativ `` html`...` ``; evenimente cu `@click="${this.#onClick}"`; stiluri izolate în `` static styles = css`...` ``.
- 🎯 Toată comparația vanilla-vs-Lit într-o propoziție: *template-uri declarative + reactivitate automată în loc de actualizări manuale de DOM.*

## Framework-uri (curs 13)

React (.jsx), Angular (.ts), Vue (.vue), Svelte (.svelte) — patru răspunsuri la scară industrială la *aceeași* problemă (UI reactiv, bazat pe componente), cu sintaxe diferite. Cursul arată aceeași componentă de tip counter în toate patru exact ca să facă acest punct. Nu trebuie să le știi — trebuie să știi *ce problemă au în comun*.

## JS front-end (cursurile 05–06) — util în interiorul altor răspunsuri

- `let`/`const`, template strings `` `${x}` ``, arrow functions, `for...of`, obiecte, clase.
- DOM: `document.getElementById`, `querySelector(All)`, `createElement`, `element.remove()`, `innerText` vs `innerHTML`, `classList`, `getAttribute`/`setAttribute`, `input.value`, `checkbox.checked`, `addEventListener("click", fn)`.

---

# 🌟 Ideile mari care revin — dacă nu reții nimic altceva

> 1. 🔄 **Clientul întreabă, serverul răspunde; HTTP uită totul între requesturi** (→ de aceea există cookie-urile/sesiunile).
> 2. 🔢 **4xx = vina clientului, 5xx = vina serverului.**
> 3. ⚡ **Async: `return`/`throw` mor în callback-uri → Promise (`resolve`/`reject`) → `await` + `try/catch`.** Un singur șablon, refolosit pentru timere *și* pentru MySQL.
> 4. 🔐 **Toate cele trei povești de securitate sunt același defect: datele utilizatorului tratate drept cod** (HTML în browser → XSS; SQL în baza de date → injection) **sau stocate fără lacăt cu sens unic** (parole în clar → hashing + salt + bcrypt). Soluția: separă datele de cod (escapare, query-uri parametrizate) și hash-uiește cu salt.

# ✅ Întrebări probabile de examen (auto-testare)

**HTML/CSS:**

- [ ] 1. Descrie structura unui document HTML și rolul `<head>` vs `<body>`. Dă exemple de taguri semantice.
- [ ] 2. Ce este box model-ul CSS? Desenează-l și explică margin/border/padding/content și `box-sizing`.
- [ ] 3. Enumeră cele trei moduri de a include CSS și tipurile de selectori de bază. Ce este specificitatea?
- [ ] 4. Compară unitățile CSS: px vs em vs rem vs % vs vw/vh.
- [ ] 5. Ce este design-ul responsive? Scrie un media query care schimbă un layout grid de la 1 coloană (mobil) la 3 coloane (desktop).
- [ ] 6. Ce sunt pseudo-clasele? Dă 4 exemple. Ce fac `transition` și `transform`?

**Server:**

- [ ] 1. Care sunt modurile de a încărca o pagină web / de a face requesturi HTTP? Compară servere statice vs dinamice și SSR vs CSR.
- [ ] 2. Scrie un server static Express. Scrie un API `GET /sum` care citește `a` și `b` din query string, cu status codes corecte (200/400).
- [ ] 3. Verbe HTTP + status codes: proiectează un API REST pentru o listă de eroi (GET/POST/PUT/DELETE).
- [ ] 4. De ce nu funcționează `return` în callback-ul lui `setTimeout`? Repară cu Promise + async/await (scrie ambele versiuni).
- [ ] 5. Ce este connection pooling? Scrie `runQuery` care promisifică `pool.query`.
- [ ] 6. Ce este hashing-ul? Atacuri (dicționar, brute force, rainbow tables) și apărări (salt, pepper, key stretching, bcrypt). Explică părțile unui hash bcrypt.
- [ ] 7. Explică XSS (stored) cu un vector de atac și rezolvarea escapeHtml.
- [ ] 8. Explică SQL injection cu vectorii `' OR '1=1` / `union select` și rezolvarea prin query-uri parametrizate.
- [ ] 9. Ce sunt cookie-urile și sesiunile? Scrie fluxul login/logout/rută protejată cu express-session.

# 📚 Cum să înveți cu acest ghid

```text
  1️⃣ CITEȘTE explicația  ──▶  2️⃣ CITEȘTE codul,        ──▶  3️⃣ ÎNCHIDE fișierul și
     până când analogia          povestindu-l cu              RESCRIE codul din
     are sens FĂRĂ cod           vorbele explicației           poveste. Verifică.
                                                                     │
            ┌────────────────────────────────────────────────────────┘
            ▼
  Ce ai greșit = partea pe care nu o înțeleseseși de fapt.
  Recitește ACEA explicație (nu codul!), apoi:

  4️⃣ ÎNCHEIE cu întrebările de auto-testare, cu voce tare sau pe hârtie.
```

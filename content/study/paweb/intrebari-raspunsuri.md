---
title: "Întrebări și răspunsuri model"
updated: 2026-06-10
---

# ❓ Programare Web — Întrebări și Răspunsuri Model

> **Cum folosești fișierul:** acoperă răspunsul, citește întrebarea, răspunde cu voce tare sau pe hârtie, apoi compară. Fiecare răspuns e scris **exact așa cum l-ai scrie pe foaia de examen** — definiție → explicație → cod/desen.
>
> 📘 Pentru explicații detaliate și analogii, vezi `EXAM-GUIDE.md`.

---

## 🧱 SECȚIUNEA A — HTML & CSS (1 întrebare la examen)

---

### Î1. Descrie structura unui document HTML și rolul `<head>` vs `<body>`. Dă exemple de taguri semantice.

**Răspuns:**

HTML (HyperText Markup Language) este un limbaj de marcare (nu de programare) care etichetează conținutul unei pagini, astfel încât browserul să știe ce reprezintă fiecare parte.

Orice document HTML are structura:

```html
<!DOCTYPE html>                 <!-- prima linie: activează modul standard -->
<html lang="en">                <!-- elementul rădăcină -->
  <head>
    <meta charset="UTF-8" />    <!-- codificarea caracterelor (diacritice!) -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Titlul paginii</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- conținutul vizibil -->
  </body>
</html>
```

- **`<head>`** = metadate, informații *despre* pagină (titlu, charset, CSS-ul încărcat). **Nu se afișează** pe ecran.
- **`<body>`** = tot conținutul **vizibil** pentru utilizator.
- `<!DOCTYPE html>` îi spune browserului să interpreteze pagina după regulile moderne (standards mode).
- `<meta charset="UTF-8">` spune cum se decodifică octeții în litere — fără el, diacriticele (ă, ș, ț) apar greșit.

**Taguri semantice** — containere al căror nume descrie rolul conținutului (spre deosebire de `<div>`, care e anonim): `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.

**De ce există:** 1) accesibilitate (screen readerele sar direct la conținut), 2) SEO (motoarele de căutare înțeleg structura), 3) cod mai ușor de citit.

```text
┌──────────── <header> ────────────┐
├───────────── <nav> ──────────────┤
├──────── <main> ───────┬─ <aside>─┤
├──────────── <footer> ────────────┘
```

---

### Î2. Ce este box model-ul CSS? Desenează-l și explică margin / border / padding / content și `box-sizing`.

**Răspuns:**

În CSS, **fiecare element din pagină este o cutie dreptunghiulară** formată din patru straturi, din interior spre exterior:

```text
┌─ margin (spațiu transparent ÎN AFARĂ) ────────┐
│  ┌─ border (marginea vizibilă) ────────────┐  │
│  │  ┌─ padding (spațiu ÎN INTERIOR) ──────┐│  │
│  │  │     content (text, imagine)         ││  │
│  │  └─────────────────────────────────────┘│  │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

- **content** — conținutul propriu-zis (text, imagine);
- **padding** — spațiul dintre conținut și border; e *în interiorul* elementului, primește culoarea de fundal;
- **border** — marginea vizibilă a elementului;
- **margin** — spațiul dintre element și vecinii lui; e *în exterior*, mereu transparent.

🎯 *Padding-ul împinge border-ul departe de conținut; margin-ul împinge celelalte elemente departe de border.*

```css
div {
  width: 300px;
  padding: 10px;
  border: 1px solid black;
  margin: 20px;
  box-sizing: border-box;
}
```

**`box-sizing`:** implicit (`content-box`), `width: 300px` se referă doar la conținut — padding-ul și border-ul se **adaugă** (lățime totală = 300 + 2×10 + 2×1 = 322px). Cu `box-sizing: border-box`, 300px devine lățimea **totală** (content + padding + border încap în ea) — de aceea proiectele reale îl setează global.

---

### Î3. Enumeră cele trei moduri de a include CSS și tipurile de selectori de bază. Ce este specificitatea?

**Răspuns:**

**Cele trei moduri de a include CSS:**

1. **Inline** — atributul `style` direct pe element: `<p style="color:red">`. Cea mai mare specificitate, dar greu de întreținut — de evitat.
2. **Intern** — bloc `<style>` în `<head>`. Valabil doar pentru pagina respectivă.
3. **Extern** — fișier separat legat cu `<link rel="stylesheet" href="style.css" />`. **Recomandat**, pentru că oferă: *separarea responsabilităților* (conținut vs aspect), *reutilizare* pe toate paginile site-ului și *caching* în browser.

**Selectori de bază:**

| Selector | Exemplu | Selectează |
|---|---|---|
| element | `p` | toate elementele `<p>` |
| clasă | `.menu` | toate elementele cu `class="menu"` (refolosibilă pe multe elemente) |
| id | `#header` | elementul cu `id="header"` (unic pe pagină) |
| universal | `*` | toate elementele |
| grupare | `h1, h2` | ambele tipuri |
| descendent | `nav a` | linkurile aflate în interiorul `<nav>` |

**Specificitatea** decide ce regulă câștigă atunci când mai multe reguli vizează același element: cu cât țintirea e mai precisă, cu atât regula e mai puternică:

```text
element  <  .clasă  <  #id  <  style inline  <  !important
```

La specificitate egală, câștigă regula scrisă **ultima**. De aici vine numele „Cascading Style Sheets": regulile „curg" peste pagină, iar conflictele se rezolvă prin specificitate.

---

### Î4. Compară unitățile CSS: px vs em vs rem vs % vs vw/vh.

**Răspuns:**

Întrebarea-cheie pentru fiecare unitate este: **„relativ la ce?"**

| Unitate | Tip | Relativ la |
|---|---|---|
| `px` | absolută | pixelul ecranului — valoare fixă |
| `pt` | absolută | 1/72 inch (tipar) |
| `%` | relativă | elementul **părinte** (`width: 50%` = jumătate din container) |
| `em` | relativă | font-size-ul **părintelui** |
| `rem` | relativă | font-size-ul **rădăcinii** (`html`) |
| `vw`/`vh` | relativă | 1% din lățimea/înălțimea ferestrei (viewport) |

**Diferența esențială em vs rem:** `em` se raportează la părinte, deci valorile se **înmulțesc în cascadă** (1.2em într-un element care are deja 1.2em = 1.44×) — greu de prezis. `rem` se raportează mereu la rădăcină, deci e **predictibil** — de aceea site-urile moderne îl preferă.

**De ce contează:** un layout în `px` este înghețat; unul în unități relative (`rem`, `%`, `vw`) se scalează când utilizatorul schimbă dimensiunea ecranului sau mărește textul — fundamentul design-ului responsive. `100vh` = exact înălțimea ferestrei.

---

### Î5. Ce este design-ul responsive? Scrie un media query care schimbă un layout grid de la 1 coloană (mobil) la 3 coloane (desktop).

**Răspuns:**

**Design responsive** = aceeași pagină se afișează corect pe orice dimensiune de ecran (telefon de 360px sau monitor de 1920px), pentru că **detectează spațiul disponibil și se rearanjează singură**.

**Cele patru unelte:**

1. **Meta tag-ul viewport** — obligatoriu; fără el telefoanele simulează un desktop de 980px și micșorează pagina:
   `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
2. **Unități relative** (`rem`, `%`, `vw/vh`).
3. **Media queries** — un „if" pentru CSS: `@media (min-width: 768px) {...}` = reguli aplicate doar de la 768px în sus.
4. **Grid / Flexbox** — sisteme de layout care distribuie spațiul.

**Strategia mobile-first:** layout-ul simplu (1 coloană) este implicitul; media queries cu `min-width` *adaugă* complexitate pentru ecrane mari.

```css
/* Mobile first: o coloană */
body {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr;
}

/* De la 768px în sus: 3 coloane */
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

`1fr` = „o parte din spațiul rămas"; `grid-column: 1 / 4` = de la linia 1 la linia 4 a gridului, adică peste toate cele 3 coloane (pentru header și footer).

```text
   MOBIL                      DESKTOP (≥768px)
  ┌────────┐              ┌──────────────────────┐
  │ header │              │        header        │
  │  nav   │              ├─────┬────────┬───────┤
  │  main  │     ──▶      │ nav │  main  │ aside │
  │ aside  │              ├─────┴────────┴───────┤
  │ footer │              │        footer        │
  └────────┘              └──────────────────────┘
```

---

### Î6. Ce sunt pseudo-clasele? Dă 4 exemple. Ce fac `transition` și `transform`?

**Răspuns:**

O **pseudo-clasă** selectează un element **doar cât timp se află într-o anumită stare** — stilizezi *stări*, nu elemente. Sintaxa: `selector:stare`.

**Exemple:**

```css
a:hover { color: red; }                    /* mouse-ul e deasupra */
input:focus { border-color: blue; }        /* are focus de tastatură */
input:checked { ... }                      /* checkbox/radio bifat */
input:disabled { ... }                     /* dezactivat */
tr:nth-child(even) { background: #eee; }   /* rânduri pare → tabel zebră */
```

**`transform`** = *destinația*: modifică forma/poziția elementului — `rotate()`, `scale()`, `translateX()`, `skew()`. Singur, schimbarea e instantanee.

**`transition`** = *călătoria*: animează lin schimbarea unei proprietăți, în loc de salt — „când proprietatea se schimbă, treci la noua valoare în 0.5s".

Rețeta: `transition` pe starea de bază, noul `transform` pe `:hover`:

```css
.card {
  transition: transform 0.5s ease;
}
.card:hover {
  transform: rotate(10deg) scale(1.2) translateX(20px);
}
```

---

## 🌐 SECȚIUNEA B — SERVER (2 întrebări la examen)

---

### Î7. Care sunt modurile de a încărca o pagină web și de a face requesturi HTTP? Compară SSR vs CSR.

**Răspuns:**

**Trei moduri de a încărca o pagină web:**

1. **Protocolul `file://`** — browserul deschide fișierul direct de pe disc, fără server. Merge doar pentru pagini simple; nu suportă requesturi, baze de date sau conținut dinamic.
2. **Un server web existent** — Live Server din VS Code (localhost:5500) sau servere profesionale: **Nginx, Apache, Microsoft IIS**.
3. **Un server scris de tine** — necesar când ai nevoie de logică (calcule, baze de date, autentificare). În Node.js, cel mai popular pachet este **Express**.

**Trei moduri de a face requesturi:**

1. **Bara de adrese a browserului** — simplu, dar doar GET și ascunde status codes/headere.
2. **Clienți GUI** — Postman/RestMan: orice metodă, vizibilitate completă.
3. **CLI** — `curl "http://localhost:8080" -X GET`.

**SSR vs CSR** — întrebarea: *cine transformă datele în HTML?*

| | SSR | CSR |
|---|---|---|
| HTML-ul se construiește | pe **server** (template engine: EJS, PUG) | în **browser** (fetch + DOM) |
| Serverul trimite | pagina gata făcută | date brute (JSON) printr-un API |
| Avantaj | prima încărcare rapidă, SEO bun | pagina se actualizează fără reload, ca o aplicație |
| Analogie | 🍽️ restaurant: primești mâncarea gătită | 🥡 meal kit: primești ingredientele și gătești acasă |

---

### Î8. Scrie un server static Express și un API `GET /sum` care citește `a` și `b` din query string, cu status codes corecte (200/400).

**Răspuns:**

Orice server Express are trei pași: **1)** creezi aplicația, **2)** declari rutele/middleware-ul, **3)** asculți pe un port.

**Server static** (servește fișiere din folderul `public`, fără logică):

```js
const express = require("express");
const server = express();
const PORT = 8080;

server.use(express.static("public"));   // servește fișierele din /public

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
```

Acces: `http://localhost:8080/index.html` (sau doar `/` — `index.html` e implicit).

**API `GET /sum`** — datele vin în query string: `http://localhost:8080/sum?a=1&b=2`. Tot ce vine din URL este **string**, de aceea convertim cu `Number()` și validăm cu `isNaN`:

```js
server.get("/sum", (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (isNaN(a) || isNaN(b)) {
    res.status(400).send("invalid operands");   // 400 = vina clientului
  } else {
    res.status(200).send(`${a + b}`);           // 200 = succes
  }
});
```

Șablonul de reținut: *citește din `req.query` → validează → 400 dacă datele sunt invalide, 200 + rezultat dacă sunt bune.*

---

### Î9. Verbe HTTP și status codes: proiectează un API REST pentru o listă de eroi (GET/POST/PUT/DELETE).

**Răspuns:**

**Verbele HTTP** exprimă intenția requestului și se mapează 1:1 pe operațiile **CRUD**; un API proiectat astfel se numește **REST**:

| Verb | CRUD | Exemplu |
|---|---|---|
| GET | read | `GET /heroes` → lista |
| POST | create | `POST /heroes?name=Tony` |
| PUT | update | `PUT /heroes?oldName=John&newName=Tony` |
| DELETE | delete | `DELETE /heroes?name=John` |

**Status codes** — prima cifră e categoria: **2xx** = succes (`200` OK, `201` Created), **4xx** = vina clientului (`400` Bad Request, `404` Not Found), **5xx** = vina serverului (`500` Internal Server Error). 🧠 *4 = tu, 5 = eu (serverul).*

```js
const express = require("express");
const cors = require("cors");
const server = express();
let heroes = ["John", "Peter"];

server.use(cors());   // permite requesturi de pe alt origin (front-end pe alt port)

server.get("/heroes", (req, res) => res.status(200).json(heroes));

server.post("/heroes", (req, res) => {
  const name = req.query.name;
  if (!name) return res.status(400).json({error: "Name query param is required"});
  heroes.push(name);
  res.status(201).json({message: "Hero added", heroes});   // 201 = creat
});

server.delete("/heroes", (req, res) => {
  const {name} = req.query;
  if (!name) return res.status(400).json({error: "Name query param is required"});
  heroes = heroes.filter(h => h !== name);
  res.json({message: "Deleted", heroes});
});

server.listen(8081, () => console.log("API server running"));
```

**De ce `cors()`:** browserul blochează implicit fetch-urile între origini diferite (ex. pagina pe `localhost:5500`, API-ul pe `localhost:8081`). Middleware-ul `cors` adaugă header-ul care permite explicit accesul — fără el apare clasicul „merge în Postman, dar nu în browser".

---

### Î10. De ce nu funcționează `return` în callback-ul lui `setTimeout`? Repară cu Promise + async/await (ambele versiuni).

**Răspuns:**

**Versiunea greșită:**

```js
function computeSumWithDelay(a, b, delay) {
  setTimeout(() => {
    if (isNaN(a) || isNaN(b)) {
      throw new Error(`Not a number`);
    }
    return a + b;       // ⚠️ return din CALLBACK, nu din computeSumWithDelay
  }, delay);
}
```

**De ce nu merge:** `computeSumWithDelay` doar predă callback-ul lui `setTimeout` și **se termină imediat**, fără `return` propriu → apelantul primește `undefined` pe loc. Când, după `delay` milisecunde, callback-ul rulează, `return`-ul lui iese din *callback* (o altă funcție), în mecanismul timerului, unde nu ascultă nimeni — valoarea se pierde. La fel, `throw`-ul se întâmplă după ce `try/catch`-ul apelantului s-a închis demult, deci nu mai are cine să-l prindă.

🎯 *`return` și `throw` urcă doar pe stiva de apeluri activă în acel moment; când rulează callback-ul asincron, stiva apelantului a dispărut.*

**Versiunea corectă** — împachetăm în Promise: `resolve` înlocuiește `return`, `reject` înlocuiește `throw`; apelantul devine `async`, folosește `await` și prinde erorile cu `try/catch`:

```js
function computeSumWithDelay(a, b, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isNaN(a) || isNaN(b)) {
        reject(new Error(`Not a number`));   // reject = throw asincron
      }
      resolve(a + b);                        // resolve = return asincron
    }, delay);
  });
}

async function main() {
  try {
    const sum = await computeSumWithDelay(1, 2, 1000);
    console.log(sum);
  } catch (error) {
    console.log(error.message);              // reject aterizează în catch
  }
}
main();
```

**Simetria:**

| Sincron | Asincron |
|---|---|
| `return valoare` | `resolve(valoare)` |
| `throw eroare` | `reject(eroare)` |
| apel direct | `await` |
| `try/catch` | `try/catch` în jurul lui `await` |

---

### Î11. Ce este connection pooling? Scrie funcția `runQuery` care promisifică `pool.query`.

**Răspuns:**

**Connection pooling:** deschiderea unei conexiuni la baza de date este costisitoare (handshake de rețea, autentificare). În loc să deschidă și să închidă o conexiune pentru fiecare request, pool-ul păstrează un **cache de conexiuni reutilizabile** (ex. `connectionLimit: 10`): un query ia o conexiune liberă, o folosește și o returnează. Rezultat: requesturi mai rapide și o limită fermă de conexiuni simultane — baza de date scalează bine când traficul crește.

`pool.query(sql, params, callback)` este în stil callback — exact problema de la Î10 — așa că îl împachetăm în Promise cu aceeași rețetă:

```js
const mysql = require("mysql");
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "sa",
  database: "first_db",
});

// promisificare: același șablon ca la setTimeout
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

💡 De punctat la examen: **schimbările sunt identice cu cele de la exercițiul cu `setTimeout`** — e același șablon (Promise + resolve/reject + async/await), aplicat unei baze de date. MySQL rulează ca server separat pe portul **3306**.

---

### Î12. Ce este hashing-ul? Prezintă atacurile (dicționar, brute force, rainbow tables) și apărările (salt, pepper, key stretching, bcrypt). Explică părțile unui hash bcrypt.

**Răspuns:**

**Hashing** = transformarea unui string de lungime variabilă într-o amprentă de lungime fixă, printr-un algoritm cu patru proprietăți: **1)** determinist (aceeași intrare → aceeași ieșire), **2)** rapid, **3)** imposibil practic de inversat, **4)** rezistent la coliziuni.

Parolele **nu se stochează niciodată în clar** — dacă baza de date e furată, toate parolele ar fi compromise. Se stochează hash-ul; la login se hash-uiește ce a tastat utilizatorul și se compară amprentele. Algoritmi: MD5 (128 biți, 1991 — spart, nu se folosește), SHA-256 / SHA-512 (2001 — standardele moderne).

**Atacuri** (hash-ul nu se poate inversa, deci atacatorul ghicește „înainte"):

| Atac | Cum funcționează |
|---|---|
| **Dicționar** | hash-uiește o listă de parole probabile și compară amprentele |
| **Brute force** | încearcă sistematic toate combinațiile de caractere — garantat, dar lent |
| **Rainbow tables** | tabele precalculate parolă→hash; spargerea devine o căutare |

**Apărări:**

| Apărare | Descriere | Învinge |
|---|---|---|
| **Salt** | string aleator, **unic per utilizator**, concatenat la parolă înainte de hash; stocat în clar lângă hash. Parole identice → hash-uri diferite | rainbow tables |
| **Pepper** | ca salt-ul, dar **același pentru toți** și **secret**, păstrat în afara bazei de date | furtul bazei de date |
| **Key stretching** | hash-ul rulat de mii de ori; login-ul real nu simte, atacatorul cu miliarde de încercări da | brute force |
| Plus: parole puternice obligatorii, limitarea încercărilor de login | | |

**bcrypt** combină totul: generează automat salt unic per parolă și are **cost factor** configurabil (key stretching).

**Anatomia hash-ului bcrypt:**

```text
$2b$12$KIXI/JhO7jWgBvijUvNzbu5q3lXeBGaXQ5xGxyupj1tB5mBns7k1W
 ─┬ ─┬ └─────────┬──────────┘└────────────┬────────────────┘
  │  │      salt (22 car.,          hash-ul propriu-zis
  │  │      base64, LA VEDERE)
  │  └── cost factor: 2¹² runde
  └── versiunea bcrypt
```

Salt-ul stă *în interiorul* string-ului stocat — astfel login-ul poate reface exact același calcul.

---

### Î13. Explică XSS (stored) cu un vector de atac și rezolvarea.

**Răspuns:**

**Cross-Site Scripting (XSS)** = vulnerabilitate prin care un atacator injectează scripturi malițioase în pagini văzute de alți utilizatori. Cauza: site-ul afișează conținut tastat de utilizatori **ca HTML brut**, deci browserul îl *execută* în loc să-l *afișeze*. Scripturile pot fura cookie-uri/sesiuni sau redirecționa utilizatorii.

**Stored XSS** = payload-ul e salvat pe server (în baza de date), deci **fiecare vizitator viitor** îl declanșează.

**Vectorul din curs:** se adaugă un erou cu numele:

```html
<img src onerror='alert("hacked")'>
```

Când pagina afișează lista de eroi cu `innerHTML`, browserul parsează string-ul ca un tag `<img>` real; imaginea nu se încarcă (src gol) → `onerror` execută JavaScript-ul atacatorului în browserul fiecărui vizitator.

**Rezolvarea — escaparea:** înainte de inserarea în pagină, caracterele speciale HTML se transformă în **entități**, astfel browserul le afișează ca text inofensiv în loc să le execute:

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

(Echivalent: folosirea `innerText` în loc de `innerHTML` — `innerText` nu parsează niciodată HTML.)

💡 Esența: **separă datele de cod** — textul utilizatorului e *date*, nu HTML.

---

### Î14. Explică SQL injection cu vectorii `' OR '1=1` / `union select` și rezolvarea prin query-uri parametrizate.

**Răspuns:**

**SQL Injection** = vulnerabilitate prin care atacatorul manipulează un query SQL injectând input malițios, obținând acces neautorizat la date. Cauza: query-ul e construit prin **lipire de string-uri**, deci textul utilizatorului ajunge *în interiorul* comenzii SQL:

```js
sql = `SELECT name, level FROM heroes WHERE name='${textToSearch}';`;
```

Un apostrof tastat de utilizator **închide string-ul devreme** și restul devine SQL executabil.

**Escaladarea atacului (din curs):**

1. `' OR '1=1` → WHERE devine mereu adevărat → **se afișează toată tabela** (dovada vulnerabilității).
2. `' order by 1; %23` → află **numărul de coloane** (crești numărul până apare eroarea). `%23` = `#` codificat URL = comentariu SQL care **neutralizează restul query-ului original**.
3. `' union select version(),database(); %23` → `UNION` lipește SELECT-ul atacatorului → **versiunea MySQL și numele bazei**.
4. `' union select TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS where TABLE_SCHEMA="first_db"; %23` → **harta completă**: toate tabelele și coloanele.
5. `' union select name, password FROM heroes; %23` → **utilizatorii și parolele**. Game over.

**Rezolvări, în ordinea calității:**

```js
// bine: escapare — dar trebuie aplicată manual peste tot
sql = `SELECT name, level FROM heroes WHERE name=${mysql.escape(textToSearch)};`;

// mai bine: QUERY PARAMETRIZAT — răspunsul corect
sql = `SELECT name, level FROM heroes WHERE name=?;`;
const result = await runQuery(sql, [textToSearch]);
```

Cu placeholder-ul `?`, comanda și datele ajung la baza de date pe **canale separate**, deci inputul utilizatorului **nu este niciodată interpretat ca SQL**, indiferent ce conține. (Aceeași idee ca la XSS: separă datele de cod.)

---

### Î15. Ce sunt cookie-urile și sesiunile? Scrie fluxul login / rută protejată / logout cu express-session.

**Răspuns:**

**Problema:** HTTP este **stateless** — fiecare request e o conversație nouă; serverul nu reține cine ești între requesturi.

**Cookie** = pereche cheie/valoare pe care **serverul o setează** într-un răspuns, iar **browserul o stochează și o atașează automat** la fiecare request viitor către același server. Are termen de expirare (`maxAge`) și poate fi șters (`clearCookie`).

```js
const cookieParser = require("cookie-parser");
server.use(cookieParser());                  // parsează header-ul Cookie → req.cookies
res.cookie("cheie", "valoare", {maxAge: 120 * 1000});
res.clearCookie("cheie");
```

**De ce nu stocăm datele direct în cookie:** clientul își poate **edita** cookie-urile — oricine ar falsifica „loggedIn=true".

**Sesiunea** rezolvă asta împărțind stocarea: datele reale stau **pe server**; cookie-ul (`connect.sid`) ține doar un **session-id** lung, aleator, semnat cu `secret`-ul serverului (nu poate fi ghicit sau falsificat). 🧠 Analogie: sesiunea = camera de hotel, cookie-ul = cardul de acces.

**Fluxul de autentificare:**

1. **Login:** clientul trimite credențialele prin **POST, în body** (nu în URL — URL-urile ajung în loguri/istoric); body-ul cere middleware-ul `express.json()`.
2. Serverul **validează** (contra hash-urilor bcrypt).
3. Valid → scrie în sesiune: `req.session.isLoggedIn = true`.
4. Răspunsul duce cookie-ul cu session-id la browser.
5. Requesturile următoare poartă **automat** cookie-ul → serverul regăsește sesiunea.
6. **Rutele protejate** verifică: `if (req.session.isLoggedIn) ...`.
7. **Logout:** `req.session.destroy()` + `clearCookie`.

```js
const session = require("express-session");

app.use(express.static("public"));
app.use(express.json());                 // parsează body JSON → req.body
app.use(session({
  secret: "secret-key",                  // semnează cookie-ul de sesiune
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1200000},
}));

app.post("/login", (req, res) => {
  req.session.isLoggedIn = false;
  const {user, pass} = req.body;         // credențiale în BODY, nu în URL
  if (isValid(user, pass)) {
    req.session.user = user;
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

---

## ⚡ BONUS — Întrebări scurte (răspuns în 1–3 propoziții)

<details>
<summary><strong>B1. Ce diferență e între un element și un atribut HTML?</strong></summary>

Elementul e întregul ansamblu: tag de deschidere + conținut + tag de închidere (`<p>text</p>`). Atributul e o informație suplimentară în tagul de deschidere (`href`, `src`, `id`, `class`), ca un adjectiv.
</details>

<details>
<summary><strong>B2. Ce sunt entitățile HTML și de ce există?</strong></summary>

Coduri de forma `&lt;` (<), `&gt;` (>), `&amp;` (&) pentru caractere rezervate de HTML — dacă ai scrie `<` direct, browserul ar crede că începe un tag. Aceeași transformare este și soluția pentru XSS.
</details>

<details>
<summary><strong>B3. Ce diferență e între GET și POST la un formular?</strong></summary>

GET pune datele în URL ca query string (`/sum?a=1&b=2`) — vizibile, bune pentru căutări. POST le pune în body — invizibile în URL, obligatorii pentru date sensibile (login).
</details>

<details>
<summary><strong>B4. Ce înseamnă `localhost:8080`?</strong></summary>

`localhost` (= `127.0.0.1`) este propriul calculator; `8080` este portul — „numărul apartamentului" la care ascultă aplicația-server. O mașină poate rula mai multe servere pe porturi diferite.
</details>

<details>
<summary><strong>B5. Ce face `npm init -y` și `npm i express`?</strong></summary>

`npm init -y` creează `package.json` (manifestul proiectului). `npm i express` descarcă pachetul Express în `node_modules` și îl înregistrează ca dependență în `package.json`.
</details>

<details>
<summary><strong>B6. La ce folosește nodemon?</strong></summary>

Urmărește fișierele și repornește automat serverul la fiecare salvare (`nodemon server.js`), eliminând Ctrl+C + restart manual.
</details>

<details>
<summary><strong>B7. De ce sunt necesare DOUĂ await-uri la fetch?</strong></summary>

`await fetch(...)` așteaptă sosirea răspunsului (status, headere); `await response.json()` așteaptă citirea și parsarea body-ului. Sunt doi pași diferiți în timp.
</details>

<details>
<summary><strong>B8. Ce este CORS și când apare problema?</strong></summary>

O regulă de siguranță a browserului: o pagină de pe un origin (localhost:5500) nu poate face fetch către alt origin (localhost:8081) fără permisiunea explicită a acelui server. Middleware-ul `cors()` adaugă header-ul de permisiune. Simptom clasic: merge în Postman, nu în browser.
</details>

<details>
<summary><strong>B9. Diferența dintre salt și pepper?</strong></summary>

Salt: aleator, unic per utilizator, stocat în clar lângă hash. Pepper: același pentru toți, secret, păstrat în afara bazei de date. Ambele se adaugă parolei înainte de hash.
</details>

<details>
<summary><strong>B10. De ce credențialele se trimit prin POST în body, nu prin GET în URL?</strong></summary>

URL-urile sunt salvate în istoricul browserului și în logurile serverului — o parolă în URL ar rămâne scrisă peste tot. Body-ul cererii POST nu apare în URL.
</details>

<details>
<summary><strong>B11. Ce face `box-sizing: border-box`?</strong></summary>

Schimbă sensul lui `width`: în loc ca padding-ul și border-ul să se adauge peste lățime, totul trebuie să încapă în lățimea declarată — dimensiunile devin predictibile.
</details>

<details>
<summary><strong>B12. Ce este Shadow DOM (Web Components)?</strong></summary>

Un mini-document privat și sigilat al componentei (`this.attachShadow({mode: "closed"})`): CSS-ul paginii nu intră, CSS-ul componentei nu iese — încapsulare.
</details>

---

> 🌟 **Dacă nu reții nimic altceva:** clientul întreabă / serverul răspunde și HTTP uită totul (→ cookies/sesiuni) · 4xx = tu, 5xx = serverul · `return`/`throw` mor în callback-uri → Promise + async/await · toate atacurile = date tratate drept cod → escapare, query-uri parametrizate, hash cu salt.

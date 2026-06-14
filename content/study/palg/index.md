---
title: "Proiectarea Algoritmilor (PALG)"
faculty: FIESC
order: 20
updated: 2026-06-14
---

# Proiectarea Algoritmilor — ghid pentru examenul teoretic

> Univ. „Ștefan cel Mare" Suceava · examen pe Google Forms · **10 puncte** (din care **1p oficiu**).
>
> Examenul are **mereu aceleași 6 tipuri de întrebări** — se schimbă doar numerele și numele, generate aleator per student. Înveți o **metodă** pentru fiecare tip și le rezolvi pe toate.

## Baremul — cât face fiecare întrebare

| #   | Tip de întrebare                                   | Puncte |
| --- | -------------------------------------------------- | ------ |
| 1   | Propuneți o problemă cu o complexitate dată        | **2p** |
| 2   | Teorema Master (recurență → complexitate)          | **2p** |
| 3   | Vectorul de lungimi parțiale (programare dinamică) | **2p** |
| 4   | Numărul de componente conexe                       | 1p     |
| 5   | Parcurgere în adâncime (DFS) — ordinea             | 1p     |
| 6   | Gradul unui nod                                    | 1p     |
| —   | Oficiu                                             | 1p     |

> **Unde sunt punctele.** Primele trei tipuri (1–3) valorează **6p din 10**. Pune accentul pe ele; tipurile 4–6 sunt scurte și sigure odată ce știi metoda.

## Cum folosești ghidul

Fiecare tip de întrebare are **fișa lui** (sus, la „Fișe"). O fișă conține, în aceeași ordine:

- ce se cere, în cuvinte simple;
- **metoda** pas cu pas, prinsă într-o casetă;
- exemple rezolvate complet, din subiecte reale;
- o bancă de exerciții cu răspunsuri, pentru autoverificare;
- capcanele frecvente, ca să nu pierzi puncte ieftine.

> **Ordinea recomandată.** Mergi pe fișele de 2p întâi (1 → 2 → 3), apoi pe cele de 1p (4 → 5 → 6). Teorema Master (fișa 2) e cel mai ușor punctaj — o stăpânești în câteva minute.

## Harta rapidă a celor 6 tipuri

| Tip                                  | Pe scurt                              | Trucul de bază                                      |
| ------------------------------------ | ------------------------------------- | --------------------------------------------------- |
| 1 · Problemă cu o complexitate dată  | inventezi o problemă cu un Θ cerut     | memorezi 3 exemple: Θ(n), Θ(n·log n), Θ(n²)          |
| 2 · Teorema Master                   | recurență `a·T(n/b)+c·n` → Θ           | compari `a` cu `b`                                  |
| 3 · Vectorul de lungimi parțiale     | programare dinamică pe un șir          | completezi de la **dreapta** la stânga              |
| 4 · Componente conexe                | în câte „bucăți" se rupe graful        | nu uita **nodurile izolate**                        |
| 5 · DFS                              | ordinea de vizitare                    | mergi adânc, vecini în **ordine alfabetică**        |
| 6 · Gradul unui nod                  | câte muchii ating nodul                | numeri aparițiile în lista de muchii                |

---

Mult succes. Dacă găsești o greșeală sau vrei un exemplu în plus, folosește butonul **Semnalează / cere modificări**.

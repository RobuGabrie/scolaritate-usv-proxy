---
title: "1 · Propuneți o problemă cu o complexitate dată"
updated: 2026-06-14
---

> **2 puncte · răspuns liber.** Singura întrebare la care scrii text, nu bifezi.

## 1. Ce se cere

Enunțul sună așa:

> „Propuneți o problemă algoritmică (alta decât cele discutate la curs) care primește ca date de intrare **[ceva]** și pentru care rezolvarea are o complexitate temporală de ordinul **Big-Theta([ceva])**. Motivați complexitatea."

Deci trebuie:

1. să **inventezi o problemă** care lucrează pe acele date de intrare,
2. al cărei algoritm are **exact** complexitatea cerută,
3. și să **explici de ce** are acea complexitate.

## 2. Ce înseamnă Big-Theta și complexitatea temporală

- **Complexitate temporală** = câte operații face algoritmul, în funcție de mărimea datelor `n`.
- **Big-Theta Θ(...)** = ordinul exact de creștere (și limită de sus, și de jos).

Clasele care apar în examen, de la rapid la lent:

```
Θ(1)       constant      – număr fix de operații
Θ(log n)   logaritmic    – înjumătățești la fiecare pas (căutare binară)
Θ(n)       liniar        – o singură trecere prin date (o buclă)
Θ(n·log n) liniaritmic   – divide et impera (merge sort, quick sort)
Θ(n²)      pătratic      – două bucle imbricate (fiecare cu fiecare)
Θ(n³)      cubic         – trei bucle imbricate
```

**Cum „citești" complexitatea dintr-un algoritm:**

- o buclă `for i=1..n` → Θ(n)
- două bucle imbricate `for i=1..n { for j=1..n }` → Θ(n²)
- împărțirea problemei în două + recombinare liniară → Θ(n·log n)
- înjumătățirea repetată fără a parcurge tot → Θ(log n)

## 3. Rețetar — răspunsuri gata pregătite pentru fiecare cerință

În subiecte apar aceste combinații. Învață câte un exemplu sigur pentru fiecare.

### ▸ Cerere Θ(n) — date: un graf cu n muchii / n componente conexe / un vector cu n elemente

**Problema:** „Afișarea tuturor muchiilor unui graf" (sau „calcularea sumei celor n elemente dintr-un vector").

**Justificare:** parcurg fiecare muchie / element **o singură dată**, printr-o singură buclă → numărul de operații e proporțional cu n → **Θ(n)**.

### ▸ Cerere Θ(n·log n) — date: un număr întreg n (problemă recursivă, divide et impera)

**Problema:** „Sortarea a n numere prin metoda interclasării (Merge Sort)."

**Justificare:** algoritmul **împarte** vectorul în două jumătăți de fiecare dată → se creează `log₂(n)` niveluri de împărțire. La **fiecare nivel** se face interclasarea tuturor elementelor = O(n) operații. Total: `log n` niveluri × `n` operații = **Θ(n·log n)**.

> **Atenție.** Căutarea binară NU e Θ(n·log n), ci Θ(log n) — aici se pierd puncte des. Pentru n·log n trebuie merge sort / quick sort: ceva care **și împarte** (log n) **și parcurge tot** la fiecare nivel (n).

### ▸ Cerere Θ(n²) — date: n șiruri de caractere / două mulțimi de n numere / o matrice n×n / două grafuri cu n muchii

**Problema (variantă 1):** „Ordonarea alfabetică a n cuvinte folosind Bubble Sort / Selection Sort."

**Justificare:** pentru fiecare element (buclă exterioară, n pași) îl compar cu toate celelalte (buclă interioară, n pași) → n × n = **Θ(n²)**.

**Problema (variantă 2, pentru matrice n×n):** „Determinarea elementelor pare dintr-o matrice pătratică de dimensiune n."

**Justificare:** trebuie parcursă **toată matricea**, care are n × n = n² elemente → **Θ(n²)**.

**Problema (variantă 3, două mulțimi de n numere):** „Verificarea elementelor comune între două mulțimi de câte n numere."

**Justificare:** fiecare element din prima mulțime se compară cu fiecare din a doua → n × n → **Θ(n²)**.

## 4. Tabel rapid (memorează coloana din dreapta)

| Date de intrare cerute            | Complexitate | Exemplu de problemă (răspunsul tău)            |
| --------------------------------- | ------------ | ---------------------------------------------- |
| graf cu n muchii                  | Θ(n)         | afișarea tuturor muchiilor                      |
| graf cu n componente conexe       | Θ(n)         | afișarea fiecărei componente conexe             |
| un număr întreg n                 | Θ(n·log n)   | sortare prin interclasare (merge sort)          |
| n șiruri de caractere             | Θ(n²)        | ordonarea alfabetică cu bubble/selection sort   |
| două mulțimi de n numere          | Θ(n²)        | găsirea elementelor comune                      |
| două grafuri cu n muchii          | Θ(n²)        | compararea muchiilor celor două grafuri         |
| o matrice pătratică n×n           | Θ(n²)        | determinarea elementelor pare din matrice       |
| două mulțimi de n puncte în plan  | Θ(n²)        | cea mai lungă subsecvență comună                |

## 5. Cum să formulezi răspunsul (șablon de scris)

> **Problema:** [enunț scurt, 1 propoziție].
> **Rezolvare:** [cum se rezolvă, ce bucle/recursie].
> **Complexitate:** deoarece [motivul — câte bucle, câte niveluri], numărul de operații este proporțional cu [n / n·log n / n²], deci complexitatea este Θ(...).

Exemplu complet pentru Θ(n²) cu matrice:

> **Problema:** determinarea elementelor pare dintr-o matrice pătratică de dimensiune n.
> **Rezolvare:** parcurg matricea cu două bucle imbricate (linie și coloană) și verific fiecare element.
> **Complexitate:** matricea are n×n = n² elemente, fiecare verificat o dată → **Θ(n²)**.

## 6. Punctaj parțial la oral (foarte util de știut)

Din feedback-urile reale: chiar dacă răspunsul scris e incomplet, la **examinarea orală** profesorul acordă puncte pentru un „început bun de răspuns". Deci:

- scrie **măcar ideea problemei** + o justificare scurtă, nu lăsa gol;
- la oral explici mai departe și recuperezi puncte.

## 7. Greșeli frecvente (din feedback-urile reale)

- **Altă complexitate decât cea cerută** — ex. zici „căutare binară" pentru Θ(n·log n), dar aceea e Θ(log n).
- **Confuzia date de intrare ↔ cerință** — feedback real: „datele de intrare și cerința problemei nu au fost interpretate corect".
- **Algoritm fără justificare** — numești doar un algoritm, fără să explici **de ce** are acea complexitate. Justificarea aduce jumătate din puncte.
- **Problemă „de la curs"** — enunțul cere explicit **alta** decât cele discutate la curs.

## 8. Cele 3 exemple de memorat (minimul pentru examen)

1. **Θ(n)** → „parcurg/afișez cele n elemente (muchii) o singură dată, o buclă".
2. **Θ(n·log n)** → „Merge Sort: împart în 2 (log n niveluri) × interclasare O(n) pe nivel".
3. **Θ(n²)** → „două bucle imbricate: fiecare element cu fiecare" (sortare bubble / matrice n×n).

Cu astea trei acoperi toate variantele întâlnite în subiecte.

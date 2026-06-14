---
title: "5 · Parcurgere în adâncime (DFS)"
updated: 2026-06-14
---

> **1 punct.** Ordinea în care DFS vizitează nodurile, pornind dintr-un nod dat.

## 1. Ce se cere

Ți se dă un graf neorientat (listă de noduri + listă de muchii) și un **nod de start**.
Trebuie să dai **ordinea în care sunt vizitate nodurile** la o parcurgere în adâncime (DFS = Depth-First Search), pornind din acel nod. Alegi varianta corectă din grilă.

## 2. Ce înseamnă „în adâncime"

DFS = mergi cât de departe poți pe un drum, până te blochezi; abia atunci te **întorci** (backtrack) și încerci altă ramură.

Regula de departajare (foarte importantă în examen):

> Când un nod are mai mulți vecini nevizitați, alegi mereu **pe cel mai mic în ordine alfabetică** (sau numerică).

## 3. Metoda pas cu pas

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Scrie pentru fiecare nod lista de vecini, ORDONATĂ alfabetic.│
│ 2. Pornește din nodul de start, scrie-l în ordine, marchează-l. │
│ 3. Mergi la cel mai mic vecin NEVIZITAT al nodului curent.      │
│ 4. Repetă 3 din noul nod.                                       │
│ 5. Dacă nodul curent nu mai are vecini nevizitați → ÎNTOARCE-TE │
│    la nodul anterior și încearcă următorul lui vecin.           │
│ 6. Gata când toate nodurile sunt vizitate.                      │
└──────────────────────────────────────────────────────────────┘
```

## 4. Exemplu rezolvat COMPLET

Noduri: `{Andrew; Bill; Jane; John; Kate; Lisa}`
Muchii: `(Andrew-John)(Andrew-Lisa)(Bill-Jane)(Bill-John)(Jane-John)(Jane-Kate)(John-Lisa)(Kate-Lisa)`
Start: **Andrew**

### Pasul 1 — listele de vecini (ordonate alfabetic)

```
Andrew → John, Lisa
Bill   → Jane, John
Jane   → Bill, John, Kate
John   → Andrew, Bill, Jane, Lisa
Kate   → Jane, Lisa
Lisa   → Andrew, John, Kate
```

### Desenul grafului

```
        Andrew
        /     \
      John --- Lisa
     /  |  \     |
  Bill  |  Jane--Kate
     \  |  /
      (Bill-Jane, Jane-John, Bill-John formează un triunghi)
```

### Pasul 2 — trasarea (ordinea + ce fac)

```
PAS │ nod curent │ vecini nevizitați (alfabetic) │ aleg  │ ordine până acum
────┼────────────┼───────────────────────────────┼───────┼──────────────────────────
 1  │ Andrew     │ John, Lisa                    │ John  │ Andrew
 2  │ John       │ Bill, Jane, Lisa  (Andrew viz)│ Bill  │ Andrew, John
 3  │ Bill       │ Jane              (John viz)  │ Jane  │ Andrew, John, Bill
 4  │ Jane       │ Kate         (Bill,John viz)  │ Kate  │ Andrew, John, Bill, Jane
 5  │ Kate       │ Lisa              (Jane viz)  │ Lisa  │ Andrew, John, Bill, Jane, Kate
 6  │ Lisa       │ — (toți vizitați)             │ back  │ Andrew, John, Bill, Jane, Kate, Lisa
```

Toate nodurile sunt vizitate.

→ **Răspuns: Andrew; John; Bill; Jane; Kate; Lisa**

## 5. Al doilea exemplu (alt start, ca să vezi diferența)

Același graf, dar start = **Jane**:

```
 1 │ Jane   │ Bill, John, Kate → Bill │ Jane
 2 │ Bill   │ John  (Jane viz)        │ Jane, Bill
 3 │ John   │ Andrew, Lisa (Bill,Jane viz) → Andrew │ Jane, Bill, John
 4 │ Andrew │ Lisa  (John viz)        │ Jane, Bill, John, Andrew
 5 │ Lisa   │ Kate  (Andrew,John viz) │ Jane, Bill, John, Andrew, Lisa
 6 │ Kate   │ — (Jane,Lisa viz)       │ Jane, Bill, John, Andrew, Lisa, Kate
```

→ **Răspuns: Jane; Bill; John; Andrew; Lisa; Kate**

> **Reține.** Același graf, dar alt nod de start ⇒ altă ordine. De aceea trebuie să fii atent la nodul cerut.

## 6. Bancă de exerciții (din subiecte)

**Graf A** — {Andrew;Bill;Jane;John;Kate;Lisa}, muchii (Andrew-John)(Andrew-Lisa)(Bill-Jane)(Bill-John)(Jane-John)(Jane-Kate)(John-Lisa)(Kate-Lisa):

- start **Andrew** → Andrew; John; Bill; Jane; Kate; Lisa
- start **Bill** → Bill; Jane; John; Andrew; Lisa; Kate
- start **Jane** → Jane; Bill; John; Andrew; Lisa; Kate
- start **Lisa** → Lisa; Andrew; John; Bill; Jane; Kate

**Graf B** — {Andrew;Bill;Jane;John;Kate;Lisa;Mary}, muchii (Andrew-Jane)(Andrew-Kate)(Andrew-Mary)(Bill-Jane)(Bill-Kate)(Bill-Lisa)(Jane-John)(John-Lisa)(John-Mary)(Kate-Lisa)(Kate-Mary):

- start **Jane** → Jane; Andrew; Kate; Bill; Lisa; John; Mary
- start **Mary** → Mary; Andrew; Jane; Bill; Kate; Lisa; John

**Graf C** — {Andrew;Bill;Jane;John;Kate;Lisa;Mary;Robert}, muchii (Andrew-Jane)(Andrew-Kate)(Andrew-Lisa)(Andrew-Robert)(Bill-Jane)(Bill-John)(Bill-Lisa)(Bill-Mary)(Bill-Robert)(Jane-John)(John-Kate)(John-Robert)(Kate-Mary)(Kate-Robert)(Lisa-Mary):

- start **Andrew** → Andrew; Jane; Bill; John; Kate; Mary; Lisa; Robert
- start **Kate** → Kate; Andrew; Jane; Bill; John; Robert; Lisa; Mary
- start **Lisa** → Lisa; Andrew; Jane; Bill; John; Kate; Mary; Robert

> **Exercițiu.** Ia Graf B și refă singur ordinea pentru start Jane, apoi compară.

## 7. Greșeli frecvente

- **Ordinea vecinilor** — îi alegi în ordinea din lista de muchii, nu **alfabetic**. Mereu alfabetic / numeric crescător.
- **Confuzie cu BFS** — faci parcurgere „în lățime" (vizitezi toți vecinii înainte de a merge adânc). DFS = mergi adânc întâi.
- **Lipsa backtrack-ului** — când te blochezi, te întorci la nodul anterior, NU sari aiurea.
- **Revizitarea unui nod** — fiecare nod apare o singură dată în ordine.

## 8. Verificare rapidă în grilă

- Primul nod din răspuns = **nodul de start** (elimină variantele care nu încep cu el).
- Niciun nod nu se repetă (variantele care repetă un nume sunt greșite).
- Al doilea nod = cel mai mic vecin alfabetic al startului.

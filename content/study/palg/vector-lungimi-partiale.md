---
title: "3 · Vectorul de lungimi parțiale"
updated: 2026-06-14
---

> **2 puncte · programare dinamică.** Calculezi un număr pentru fiecare poziție din șir și alegi vectorul rezultat din grilă.

## 1. Ce se cere de fapt

Ți se dă o mulțime de numere întregi, de ex. `{70;53;10;48;39;38;50;16;38;9}`, și ți se cere:

> „Vectorul de lungimi parțiale generat în timpul rulării algoritmului programării dinamice pentru a determina **cea mai lungă subsecvență de elemente în ordine descrescătoare**."

Adică: pentru fiecare poziție din șir, calculezi un număr. Toate aceste numere formează **vectorul de lungimi parțiale**, și trebuie să-l alegi din grilă.

## 2. Ce e o „subsecvență descrescătoare"

O **subsecvență** = alegi elemente din șir **păstrând ordinea** (de la stânga la dreapta), dar NU trebuie să fie lipite. Le poți sări peste unele.
**Descrescătoare** = fiecare element ales e **strict mai mic** decât cel dinainte.

Exemplu în `70 53 10 48 39 38 50 16 38 9`:

- `70 → 53 → 48 → 39 → 38 → 16 → 9` este o subsecvență descrescătoare (am sărit peste 10, 50, 38) — are 7 elemente.

## 3. Ce înseamnă „lungime parțială" L[i]

Pentru **fiecare element** de pe poziția `i`, definim:

> **L[i] = lungimea celei mai lungi subsecvențe strict descrescătoare care ÎNCEPE chiar la elementul i** (privind doar spre dreapta).

Vectorul de lungimi parțiale = `[L[0], L[1], L[2], ...]`.

## 4. Metoda — se completează de la DREAPTA la STÂNGA

```
┌──────────────────────────────────────────────────────────────┐
│ 1. Ultimul element are mereu L = 1 (nu are nimic la dreapta). │
│ 2. Mergi spre stânga. Pentru elementul de pe poziția i:       │
│      - te uiți la toate elementele j din DREAPTA lui (j > i)  │
│      - care sunt STRICT MAI MICI decât val[i]                 │
│      - iei cel mai mare L[j] dintre ele                       │
│      - L[i] = 1 + acel maxim                                  │
│    Dacă nu există niciun element mai mic la dreapta → L[i]=1. │
└──────────────────────────────────────────────────────────────┘
```

Formula: `L[i] = 1 + max{ L[j] : j > i și val[j] < val[i] }`  (sau 1 dacă mulțimea e goală).

## 5. Exemplu rezolvat COMPLET, pas cu pas

Șir: `{70; 53; 10; 48; 39; 38; 50; 16; 38; 9}`

Poziții (index) și valori:

```
index:  0   1   2   3   4   5   6   7   8   9
valoare:70  53  10  48  39  38  50  16  38   9
```

Completăm de la dreapta:

```
i=9 (val=9):  nimic la dreapta                      → L[9] = 1
i=8 (val=38): la dreapta mai mic: 9 (L=1)           → L[8] = 1+1 = 2
i=7 (val=16): la dreapta mai mic: 9 (L=1)           → L[7] = 1+1 = 2
i=6 (val=50): mai mici la dreapta: 16(L=2),38(L=2),9(L=1) → max=2 → L[6] = 1+2 = 3
i=5 (val=38): mai mici: 16(2), 9(1)                 → max=2 → L[5] = 1+2 = 3
i=4 (val=39): mai mici: 38(3), 16(2), 38(2), 9(1)   → max=3 → L[4] = 1+3 = 4
i=3 (val=48): mai mici: 39(4),38(3),16(2),38(2),9(1)→ max=4 → L[3] = 1+4 = 5
i=2 (val=10): mai mici la dreapta: 9(1)             → L[2] = 1+1 = 2
i=1 (val=53): mai mici: 48(5),39(4),38(3),...       → max=5 → L[1] = 1+5 = 6
i=0 (val=70): mai mici: 53(6),48(5),...             → max=6 → L[0] = 1+6 = 7
```

Vectorul rezultat (citit de la stânga la dreapta, i=0 → i=9):

```
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 7  │ 6  │ 2  │ 5  │ 4  │ 3  │ 3  │ 2  │ 2  │ 1  │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
  70   53   10   48   39   38   50   16   38   9
```

→ **Răspuns: 7;6;2;5;4;3;3;2;2;1**

> **Observație.** Cel mai mare număr din vector (aici **7**) = lungimea celei mai lungi subsecvențe descrescătoare din tot șirul.

## 6. Al doilea exemplu (mai scurt) — ca să prinzi ritmul

Șir: `{12; 16; 59; 92; 24; 28; 40; 13}`

```
index:   0   1   2   3   4   5   6   7
valoare:12  16  59  92  24  28  40  13

i=7 (13): nimic la dreapta                  → 1
i=6 (40): mai mici: 13(1)                   → 2
i=5 (28): mai mici: 13(1)                   → 2
i=4 (24): mai mici: 13(1)                   → 2
i=3 (92): mai mici: 24(2),28(2),40(2),13(1) → 1+2 = 3
i=2 (59): mai mici: 24(2),28(2),40(2),13(1) → 1+2 = 3
i=1 (16): mai mici: 13(1)                   → 2
i=0 (12): nimic mai mic la dreapta (toate ≥12, doar 13>12) → 1
```

→ **Răspuns: 1;2;3;3;2;2;2;1**

## 7. Bancă de exerciții (toate din subiecte, cu răspuns)

| Mulțimea                          | Vector corect            |
| --------------------------------- | ------------------------ |
| {70;53;10;48;39;38;50;16;38;9}    | 7;6;2;5;4;3;3;2;2;1      |
| {7;66;22;89;55;14;92;67}          | 1;3;2;3;2;1;2;1          |
| {2;6;13;81;56;3;20;57;14}         | 1;2;2;4;3;1;2;2;1        |
| {88;48;48;79;43;2;20;98}          | 5;4;3;3;2;1;1;1          |
| {29;80;28;80;60;75;75;54}         | 2;5;1;4;2;3;2;1          |
| {92;7;73;89;7;80;15;16;75}        | 4;2;2;3;2;2;1;1;1        |
| {55;32;44;28;44;56;56;31;40;71}   | 4;2;3;1;2;3;2;1;1;1      |
| {6;96;1;20;10;31;90;6}            | 2;4;1;3;2;2;2;1          |
| {12;16;59;92;24;28;40;13}         | 1;2;3;3;2;2;2;1          |
| {91;89;41;2;67;21;73;33;89;57}    | 4;3;2;1;2;1;2;1;2;1      |
| {15;66;16;73;33;62;92;1}          | 2;3;2;3;2;2;2;1          |
| {47;23;70;81;58;28;6;98}          | 3;2;4;4;3;2;1;1          |
| {58;75;5;12;9;93;19;73;74;62}     | 3;3;2;2;1;3;1;2;2;1      |
| {42;60;65;38;59;6;65;87;33}       | 3;3;3;2;2;1;2;2;1        |

> **Antrenament.** Acoperă coloana din dreapta, calculează singur, apoi verifică.

## 8. Greșeli frecvente

- **Direcția de calcul** — definiția aici e „**începe la i**", deci se calculează de la **dreapta** spre stânga (de la stânga merge doar dacă definiția ar fi „se termină la i").
- **Comparația `≤` în loc de `<`** — trebuie **strict mai mic** (descrescător strict).
- **„Lipit" în loc de subsecvență** — poți **sări peste** elemente, nu trebuie să fie consecutive.
- **Privești în stânga** — iei un element mai mic, dar aflat la stânga. Te uiți doar la **dreapta** poziției curente.

## 9. Cum verifici rapid răspunsul în grilă

- Ultimul număr din vector trebuie să fie **1** (mereu).
- Primul număr e de obicei cel mai mare (sau printre cele mai mari).
- Numerele sunt mici (1..lungimea celui mai lung lanț).

Dacă o variantă din grilă nu se termină în 1, e aproape sigur greșită.

---
title: "2 · Teorema Master"
updated: 2026-06-14
---

> **2 puncte · cel mai ușor punctaj.** Ți se dă o recurență și alegi din grilă ordinul de creștere al lui `T(n)`.

## 1. Ce se cere de fapt

Ți se dă o **recurență** de forma:

```
T(n) = a · T(n/b) + f(n)
```

și trebuie să spui care este **complexitatea** (ordinul de creștere) al lui T(n), alegând dintr-o grilă.

În examen, recurența arată mereu așa: `T(n) = a·T(n/b) + c·n` (eventual `+ const`, care se ignoră).

Exemple reale din subiecte:

- `T(n) = 3·T(n/4) + 5n`
- `T(n) = 8·T(n/2) + 9n`
- `T(n) = 6·T(n/3) + 2n + 7`

## 2. Ce înseamnă fiecare literă

```
T(n) = a · T(n/b) + f(n)
        │      │       └── f(n) = munca făcută ÎN AFARA recursiei (la fiecare pas)
        │      └────────── n/b = cât de mult se micșorează problema la fiecare apel
        └───────────────── a   = în câte subprobleme se împarte problema
```

Exemplu: `T(n) = 8·T(n/2) + 9n`

- `a = 8` → problema se sparge în 8 bucăți
- `b = 2` → fiecare bucată e de 2 ori mai mică
- `f(n) = 9n` → în plus faci `9n` operații la fiecare nivel

## 3. Intuiția — „arborele de recursie"

Imaginează-ți cum se desface recursia într-un arbore. La fiecare nivel problema se sparge în `a` copii, fiecare de dimensiune `n/b`:

```
Nivel 0:                 T(n)                 muncă: c·n
                       /  |  ...  \   (a copii)
Nivel 1:        T(n/b) T(n/b) ... T(n/b)      muncă: a · c·(n/b) = c·n·(a/b)
                /|\    /|\        /|\
Nivel 2:   T(n/b²) ............ T(n/b²)       muncă: a² · c·(n/b²) = c·n·(a/b)²
   ...
Nivel ultim: T(1) T(1) ... T(1)              (frunzele arborelui)
```

Întrebarea cheie: **cine domină** — rădăcina (vârful), nivelurile egale, sau frunzele (baza)?
Asta depinde DOAR de cum se compară **`a` cu `b`**:

| Relație | Ce domină                | Rezultat        |
| ------- | ------------------------ | --------------- |
| `a < b` | rădăcina (munca de sus)  | **Θ(n)**        |
| `a = b` | toate nivelurile la fel  | **Θ(n · log n)**|
| `a > b` | frunzele (baza)          | **Θ(n^(log_b a))** |

> **De ce.** Munca pe nivel se înmulțește cu factorul `(a/b)` de la un nivel la altul.
> - `a/b < 1` → munca scade rapid, contează doar vârful → **Θ(n)**
> - `a/b = 1` → fiecare nivel face aceeași muncă (`c·n`), iar nivelurile sunt `log_b n` → **Θ(n log n)**
> - `a/b > 1` → munca crește spre frunze, frunzele domină → **Θ(n^(log_b a))**

## 4. Rețeta de examen (învață asta pe de rost)

Pentru `T(n) = a·T(n/b) + c·n`:

```
┌─────────────────────────────────────────────┐
│  Compară a cu b:                             │
│                                              │
│   a < b   →   răspuns:  n                    │
│   a = b   →   răspuns:  n · log(n)           │
│   a > b   →   răspuns:  n^( log_b(a) )       │
└─────────────────────────────────────────────┘
```

`log_b(a)` se scrie în grilă ca `n^log_b(a)`. De ex. dacă `a=8, b=2`, scrii `n^log_2(8)` (care e n³, fiindcă log₂8 = 3).

**Trucul rapid de bifare:**

1. Dacă printre variante vezi `n^log_b(a)` ȘI `a > b` → ăla e răspunsul.
2. Dacă `a = b` → bifează `n·log(n)`.
3. Dacă `a < b` → bifează `n`.

## 5. Exemple rezolvate complet (din subiectele tale)

### Exemplul A — `T(n) = 3·T(n/4) + 5n`

- a = 3, b = 4 → **a < b**
- → **Răspuns: n**

### Exemplul B — `T(n) = 6·T(n/6) + 8n`

- a = 6, b = 6 → **a = b**
- → **Răspuns: n·log(n)**

### Exemplul C — `T(n) = 8·T(n/2) + 9n`

- a = 8, b = 2 → **a > b**
- log₂(8) = 3
- → **Răspuns: n^log_2(8)** (adică n³)

### Exemplul D — `T(n) = 6·T(n/3) + 2n + 7`

- a = 6, b = 3 → **a > b** (constanta +7 se ignoră)
- → **Răspuns: n^log_3(6)**

### Exemplul E — `T(n) = 3·T(n/2) + 6n + 4`

- a = 3, b = 2 → **a > b**
- → **Răspuns: n^log_2(3)**

## 6. Tabel cu TOATE recurențele din subiecte (verifică-te singur)

| Recurența     | a vs b | Răspuns corect    |
| ------------- | ------ | ----------------- |
| 3T(n/4)+5n    | 3 < 4  | **n**             |
| 4T(n/9)+2n+7  | 4 < 9  | **n**             |
| 4T(n/8)+2n    | 4 < 8  | **n**             |
| 4T(n/8)+4n+5  | 4 < 8  | **n**             |
| 5T(n/5)+7n    | 5 = 5  | **n·log(n)**      |
| 6T(n/6)+8n    | 6 = 6  | **n·log(n)**      |
| 8T(n/8)+6n+2  | 8 = 8  | **n·log(n)**      |
| 3T(n/2)+6n+4  | 3 > 2  | **n^log_2(3)**    |
| 8T(n/2)+9n    | 8 > 2  | **n^log_2(8)**    |
| 9T(n/2)+7n+8  | 9 > 2  | **n^log_2(9)**    |
| 4T(n/3)+7n    | 4 > 3  | **n^log_3(4)**    |
| 6T(n/3)+2n+7  | 6 > 3  | **n^log_3(6)**    |
| 7T(n/6)+8n    | 7 > 6  | **n^log_6(7)**    |

## 7. Greșeli frecvente (de evitat)

- **Cazul `a = b`** — la 5T(n/5)+7n mulți bifează **n**. Greșit: răspunsul e **n·log(n)**.
- **`a` și `b` inversate** — `a` = numărul din fața lui T (de câte ori se repetă); `b` = numitorul din T(n/b).
- **Constanta `+7`** — nu contează niciodată, doar termenul cu `n`.
- **Baza logaritmului** — e `log_b(a)` (baza = b, argumentul = a), nu invers.

## 8. Mini-test (acoperă răspunsurile și rezolvă)

1. `T(n) = 2·T(n/2) + n` → ?
2. `T(n) = 4·T(n/2) + 3n` → ?
3. `T(n) = 2·T(n/4) + 5n` → ?

> **Răspunsuri** (verifică după ce rezolvi):
> 1. a=b=2 → **n·log(n)**
> 2. a=4 > b=2, log₂4=2 → **n^log_2(4) = n²**
> 3. a=2 < b=4 → **n**

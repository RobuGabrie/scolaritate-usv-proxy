---
title: "4 · Numărul de componente conexe"
updated: 2026-06-14
---

> **1 punct.** În câte „bucăți" separate se rupe un graf neorientat.

## 1. Ce se cere

Ți se dă un **graf neorientat** prin:

- **lista de noduri**, ex. `{0;1;2;3;4;5}`
- **lista de muchii**, ex. `(0-3); (1-2); (3-5)`

și trebuie să spui în **câte „bucăți" separate** se împarte graful (= numărul de componente conexe).

## 2. Ce e o componentă conexă

O **componentă conexă** = un grup de noduri în care poți ajunge de la oricare la oricare **mergând pe muchii**. Două noduri sunt în aceeași componentă dacă există un drum între ele.

> **Insulele.** Gândește-te la insule: fiecare insulă (grup de noduri legate) e o componentă.
> Un nod **izolat** (fără nicio muchie) este o componentă de unul singur!

## 3. Metoda (sigură, pas cu pas)

```
┌────────────────────────────────────────────────────────────┐
│ 1. Desenează nodurile.                                      │
│ 2. Trage fiecare muchie din listă.                          │
│ 3. Numără grupurile separate de noduri conectate.           │
│ 4. NU uita nodurile rămase singure — fiecare = +1 componentă.│
└────────────────────────────────────────────────────────────┘
```

Alternativ (fără desen): pornește de la un nod, „colorează" tot ce poți atinge prin muchii (asta e o componentă). Treci la un nod necolorat → componentă nouă. Repetă până colorezi tot. Numărul de culori = numărul de componente.

## 4. Exemplu rezolvat 1 — cu nod izolat

Noduri: `{0;1;2;3;4;5}`
Muchii: `(0-3); (1-2); (3-5)`

Desen:

```
   0 ─── 3 ─── 5          1 ─── 2          4
   └─ componenta 1 ─┘     └─ comp.2 ─┘   (izolat = comp.3)
```

Mergem pe muchii:

- de la 0 ajung la 3, de la 3 la 5 → grupul `{0, 3, 5}`
- de la 1 ajung la 2 → grupul `{1, 2}`
- nodul `4` nu are nicio muchie → grupul `{4}`

→ **Răspuns: 3 componente**

## 5. Exemplu rezolvat 2 — totul conectat

Noduri: `{0;1;2;3;4;5;6}`
Muchii: `(0-1);(0-2);(0-3);(0-4);(1-3);(1-4);(1-5);(2-6);(3-4);(5-6)`

Listele de vecini:

```
0 → 1, 2, 3, 4
1 → 0, 3, 4, 5
2 → 0, 6
3 → 0, 1, 4
4 → 0, 1, 3
5 → 1, 6
6 → 2, 5
```

Pornim din 0 și colorăm: `0 → 1,2,3,4` ; din `1 → 5` ; din `2 → 6`.
Atins: {0,1,2,3,4,5,6} = **toate nodurile**.

Schiță:

```
        5 ─── 6
        │      │
        1 ──── 2
       /│\     │
      0─┼─┤    │
       \│/└─ 0 ┘
        3 ─ 4
```

(toate sunt într-un singur grup)

→ **Răspuns: 1 componentă**

## 6. Exemplu rezolvat 3 — multe noduri izolate

Noduri: `{0;1;2;3;4;5}`
Muchii: doar `(3-5)`

```
   3 ─── 5     0     1     2     4
```

- `{3,5}` = o componentă
- `0`, `1`, `2`, `4` = fiecare singur → încă 4 componente

→ **Răspuns: 1 + 4 = 5 componente**

## 7. Bancă de exerciții (din subiecte)

| Noduri | Muchii                                                                               | Componente                |
| ------ | ------------------------------------------------------------------------------------ | ------------------------- |
| {0..5} | (0-3)(1-2)(3-5)                                                                       | **3** (nodul 4 izolat)    |
| {0..5} | (3-5)                                                                                 | **5**                     |
| {0..5} | (0-3)(1-2)(1-4)(3-4)(3-5)                                                             | **1**                     |
| {0..5} | (0-3)(1-2)(1-4)(2-5)(3-4)(3-5)                                                        | **1**                     |
| {0..6} | (0-1)(0-2)(0-3)(0-4)(1-3)(1-4)(1-5)(2-6)(3-4)(5-6)                                    | **1**                     |
| {0..7} | (0-2)(0-3)(0-4)(0-5)(1-3)(1-4)(1-6)(2-4)(3-4)(3-5)(3-7)(4-5)(5-6)(5-7)(6-7)           | **1**                     |

## 8. Greșeli frecvente

- **Nodurile izolate** — capcana #1. Verifică mereu dacă fiecare nod din lista de noduri apare în cel puțin o muchie. Cele care nu apar → fiecare +1 componentă.
- **„Multe noduri = multe componente"** — fals. Dacă sunt toate legate, răspunsul e **1**, oricât de mari ar fi listele.
- **Numeri muchiile** în loc de grupuri.

## 9. Verificare rapidă

- Dacă **fiecare nod apare** în lista de muchii și totul pare legat → probabil **1**.
- Numără separat nodurile care **lipsesc** din lista de muchii (izolate) și adaugă-le.

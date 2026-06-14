---
title: "6 · Gradul unui nod"
updated: 2026-06-14
---

> **1 punct.** Câte muchii ating un nod dintr-un graf neorientat.

## 1. Ce se cere

Ți se dă un graf neorientat (listă de noduri + listă de muchii) și **un nod**.
Trebuie să spui **gradul** acelui nod. Enunțul poate zice „gradul", „gradul interior" sau „gradul exterior" — pentru un graf **neorientat** toate înseamnă același lucru.

## 2. Ce e gradul unui nod

> **Gradul unui nod = numărul de muchii care ating acel nod** (în câte muchii apare numele lui).

Echivalent: numărul de vecini cu care e legat direct.

```
        A
       /|\
      B C D       ← nodul A are gradul 3 (3 muchii pleacă din el)
```

## 3. Metoda (cât se poate de simplă)

```
┌────────────────────────────────────────────────────────────┐
│ Numeri de câte ori apare numele nodului în lista de muchii. │
└────────────────────────────────────────────────────────────┘
```

Atât. Treci prin toate muchiile și pui un bețișor de fiecare dată când vezi nodul căutat.

## 4. Exemplu rezolvat COMPLET

Noduri: `{Amsterdam; Berlin; Budapest; Dublin; London; Milano}`
Muchii:
`(Amsterdam-London) (Berlin-Budapest) (Berlin-Milano) (Budapest-Dublin) (Budapest-London) (Budapest-Milano) (London-Milano)`

Întrebare: **gradul nodului London**?

Căutăm „London" în fiecare muchie:

```
(Amsterdam-London)   →  conține London   = 1
(Berlin-Budapest)    ·
(Berlin-Milano)      ·
(Budapest-Dublin)    ·
(Budapest-London)    →  conține London   = 2
(Budapest-Milano)    ·
(London-Milano)      →  conține London   = 3
```

→ **Răspuns: gradul = 3**

Desen (vecinii lui London):

```
 Amsterdam ── London ── Milano
                │
            Budapest
```

London are 3 vecini: Amsterdam, Budapest, Milano → grad 3.

## 5. Al doilea exemplu

Noduri: `{Amsterdam; Berlin; Budapest; Dublin; London; Milano; Paris}`
Muchii: `(Amsterdam-Budapest)(Amsterdam-Dublin)(Berlin-Dublin)(Berlin-Milano)(Berlin-Paris)(Budapest-Milano)(Dublin-London)(Dublin-Milano)(Dublin-Paris)(London-Milano)(London-Paris)(Milano-Paris)`

Gradul nodului **Paris**? Căutăm „Paris":

```
(Berlin-Paris)  →  = 1
(Dublin-Paris)  →  = 2
(London-Paris)  →  = 3
(Milano-Paris)  →  = 4
```

→ **Răspuns: gradul = 4**

## 6. Bancă de exerciții (din subiecte)

| Nod căutat                       | Câte muchii îl conțin                                  | Grad   |
| -------------------------------- | ----------------------------------------------------- | ------ |
| London (6 noduri)                | Amsterdam-London, Budapest-London, London-Milano       | **3**  |
| Paris (7 noduri)                 | Berlin-, Dublin-, London-, Milano-Paris                | **4**  |
| Berlin (8 noduri)                | 5 muchii                                              | **5**  |
| Budapest (8 noduri, cu Prague)   | 2 muchii                                              | **2**  |
| Amsterdam (8 noduri)             | 4 muchii                                              | **4**  |
| Milano (7 noduri)                | 5 muchii                                              | **5**  |
| Prague (8 noduri)                | 5 muchii                                              | **5**  |
| Budapest (6 noduri)              | 3 muchii                                              | **3**  |
| Budapest „exterior" (6 noduri)   | Berlin-Budapest, Budapest-London                      | **2**  |
| Dublin „exterior" (8 noduri)     | 2 muchii                                              | **2**  |

> **Exercițiu.** Ia un graf, alege un nod și numără-i muchiile; verifică în tabel.

## 7. Greșeli frecvente

- **Muchia numărată de două ori** — fiecare muchie se numără o singură dată, chiar dacă nodul „apare de două ori" în scriere.
- **Muchii care NU conțin nodul** — citește atent fiecare pereche.
- **Sărit peste o muchie** la grafuri mari — fă-le pe rând, taie-le pe măsură ce le verifici.
- **„Grad interior/exterior" tratat ca graf orientat** — aici graful e **neorientat**, deci e simplu: numeri toate muchiile incidente.

## 8. Verificare rapidă

Suma gradelor tuturor nodurilor = 2 × (numărul de muchii). Poți folosi asta ca verificare globală, dar pentru un singur nod e mai rapid să numeri direct.

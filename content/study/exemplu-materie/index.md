---
title: "Exemplu de materie"
year: 1
semester: 1
order: 10
updated: 2026-06-10
---

Asta e o materie de exemplu — șterge folderul `content/study/exemplu-materie/` când adaugi materii reale.

## Cum adaugi o materie

1. Creează un folder `content/study/<slug>/` (doar litere mici, cifre și cratime).
2. Pune conținutul în `index.md` cu frontmatter (`title`, opțional `faculty`, `year`, `semester`, `order`, `updated`).
   `faculty` e codul scurt din PeopleSoft (ex. `FIESC`) — materiile sunt grupate pe facultăți, iar facultatea studentului (din profil) apare prima. Fără `faculty`, materia apare la „General".
3. Fișiere atașate (PDF-uri, imagini) merg în `content/study/<slug>/files/`.
4. Fișe suplimentare: orice alt `.md` de lângă `index.md` (ex. `intrebari.md`) devine o subpagină proprie, listată sus la „Fișe".

Pe server folderul e montat ca volum — `git pull` și modificările apar fără rebuild.

## Markdown suportat

Tabele GFM, liste, cod:

| Subiect | Status |
| ------- | ------ |
| Exemplu |     |

```c
int main(void) { return 0; }
```

> HTML brut din fișiere este escapat la randare, nu executat.

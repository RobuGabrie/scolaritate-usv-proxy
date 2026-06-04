# Cercetare Portal Scolaritate USV

## Server

- **IP:** 80.96.122.141
- **HTTP:** port 80 — răspunde cu pagina principală (nu necesită TLS)
- **HTTPS:** port 443 — TLS 1.0 exclusiv (DHE-RSA-AES256-SHA)
- **Server:** Apache/2.2.3 (Oracle) + Servlet/2.5 JSP/2.1
- **Platformă:** PeopleSoft (Oracle) — `/psp/` în URL e specific PeopleSoft
- **Certificat:** `*.usv.ro`, emis de GEANT TLS RSA 1, valabil până aug 2026

## Problema TLS

Serverul USV folosește **TLS 1.0** — browserele moderne și OpenSSL 3.x îl refuză.

**Soluție descoperită:** variabila de mediu `OPENSSL_CONF` cu un fișier custom care activează legacy:
```bash
OPENSSL_CONF=/tmp/legacy-openssl.cnf curl -k --tlsv1.0 ...
```

Config-ul legacy (`/tmp/legacy-openssl.cnf`):
```ini
openssl_conf = openssl_init

[openssl_init]
providers = provider_sect
ssl_conf = ssl_sect

[provider_sect]
default = default_sect
legacy = legacy_sect

[default_sect]
activate = 1

[legacy_sect]
activate = 1

[ssl_sect]
system_default = system_default_sect

[system_default_sect]
MinProtocol = TLSv1
CipherString = DEFAULT@SECLEVEL=0
```

În Node.js: trebuie rulat cu `NODE_OPTIONS=--openssl-legacy-provider` sau setat `OPENSSL_CONF`.

## VPN

- **Tip:** L2TP/IPsec
- **Server:** vpn.usv.ro
- **Pre-shared key:** USVL2TPKey#2018
- **Username:** prenume.nume@student.usv.ro
- **Parolă default:** `Student` + ultimele 6 cifre buletin
- **Conectare Arch:** `nmcli connection up USV-VPN`
- **Fără VPN** portalul nu e accesibil (nu e expus pe internet)

## Autentificare Login

**URL:** `https://scolaritate.usv.ro/psp/PT90SYS/?cmd=login&languageCd=ROM`
**Metodă:** POST

**Form fields:**
| Câmp | Tip | Descriere |
|---|---|---|
| `userid` | text | username USV (ex: prenume.nume@student.usv.ro) |
| `pwd` | password | parola |
| `timezoneOffset` | hidden | offset fus orar (ex: `-120` pentru Romania) |

**Cookie de sesiune:** `PTSYS2-8000-PORTAL-PSJSESSIONID`

**Flow:**
1. GET `/psp/PT90SYS/?cmd=login&languageCd=ROM` → 302 redirect → 200 cu pagina de login
2. Server setează cookie `PTSYS2-8000-PORTAL-PSJSESSIONID`
3. POST cu `userid`, `pwd`, `timezoneOffset` + cookie
4. Dacă succes → redirect la dashboard PeopleSoft

**Exemplu curl:**
```bash
OPENSSL_CONF=/tmp/legacy-openssl.cnf curl -k --tlsv1.0 -L \
  -c cookies.txt -b cookies.txt \
  -d "userid=USER&pwd=PASS&timezoneOffset=-120" \
  "https://scolaritate.usv.ro/psp/PT90SYS/?cmd=login&languageCd=ROM"
```

## Structură URL PeopleSoft

PeopleSoft folosește un pattern specific:
- `/psp/PT90SYS/` — portal entry point
- `?cmd=login` — comandă login
- `?cmd=logout` — logout
- `languageCd=ROM` sau `languageCd=ENG`

După login, navigarea notelor:
> Meniul Principal → Auto-administrare informatii → Situatie Scolara → Vizualizare note

## Implementare Proxy în Node.js

```javascript
// Variabila de mediu necesară la pornire
process.env.OPENSSL_CONF = '/path/to/legacy-openssl.cnf';

// SAU în package.json scripts:
// "dev": "OPENSSL_CONF=./legacy-openssl.cnf node server.js"

const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false,
  minVersion: 'TLSv1',  // necesită OPENSSL_CONF legacy să funcționeze
});
```

## URL-uri Utile

- Homepage: `http://scolaritate.usv.ro`
- Login RO: `https://scolaritate.usv.ro/psp/PT90SYS/?cmd=login&languageCd=ROM`
- Login EN: `https://scolaritate.usv.ro/psp/PT90SYS/?cmd=login&languageCd=ENG`
- Logout: `https://scolaritate.usv.ro/psp/PT90SYS/EMPLOYEE/HRMS/?cmd=logout`
- Dashboard: `https://scolaritate.usv.ro/psp/PT90SYS/EMPLOYEE/HRMS/h/?tab=DEFAULT`
- Identificare username: `http://scti.usv.ro/ADusers`
- Schimbare parolă: `http://epass.usv.ro`
- Finalizare studii: `http://finalizarestudii.usv.ro/`

## URL-uri Pagini (psc = direct, fără wrapper portal)

**Notă:** `/psp/` = cu wrapper portal (navbar, menu), `/psc/` = conținut iframe direct (pentru scraping)

| Pagină | URL |
|---|---|
| Auto-administrare (homepage) | `/psc/PT90SYS/EMPLOYEE/HRMS/s/WEBLIB_PTPP_SC.HOMEPAGE.FieldFormula.IScript_AppHP?pt_fname=CO_EMPLOYEE_SELF_SERVICE&FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE&IsFolder=true` |
| **Vizualizare note** | `/psc/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_GRADE.GBL` |
| Orar săptămânal | `/psp/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_SCHD_W.GBL` |
| Orar examene | `/psp/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_EXAM_L.GBL` |
| Centru studenți | `/psp/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL` |
| Medii | `/psp/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.HA_AVG_CMP.GBL` |
| Cursuri completate | `/psp/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_CRSEHIST.GBL` |
| Detalii cont financiar | `/psp/PT90SYS/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSF_SS_ACCT_SUMM.GBL` |
| Date personale | `/psp/PT90SYS/EMPLOYEE/HRMS/c/CC_PORTFOLIO.SSS_PRSNLDATA_SUMM.GBL` |
| Adrese | `/psp/PT90SYS/EMPLOYEE/HRMS/c/CC_PORTFOLIO.SS_CC_ADDRESSES.GBL` |

## Structura Răspuns Note (SSR_SSENRL_GRADE)

Câmpuri returnate per materie:
- `Clasa` — grupă
- `Nr. clasa` — număr clasă
- `Sesiune` — SM1 / SM2 (semestru)
- `Titlu lung curs` — numele materiei
- `Ponderi` — ex: `50 / 50` (curs/laborator)
- `Nota curs` — nota de la curs
- `Nota seminar/laborator` — nota de la laborator
- `Nota finala` — nota finală
- `Credite` — credite ECTS
- `Puncte nota` — credite × nota

**An academic:** parametru `PORTALPARAMNAMEINURL=yes` + implicit afișează anul curent

**Stare PeopleSoft (hidden fields necesare pentru POST):**
- `ICSID` — session token (generat la login, reutilizat)
- `ICStateNum` — număr stare pagină (incrementat la fiecare request)
- `ICAction` — acțiunea (ex: `#ICSearch`, `None`)

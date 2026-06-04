# Linear.app Design Tokens — Extras din CSS Real

## Fonturi

```css
--font-regular: "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-monospace: "Berkeley Mono", ui-monospace, "SF Mono", "Menlo", monospace;
--font-serif-display: "Tiempos Headline", ui-serif, Georgia, serif;
```

**Font weights:**
```css
--font-weight-light:   300;
--font-weight-normal:  400;
--font-weight-medium:  510;   /* <- non-standard, inter variable specific */
--font-weight-semibold: 590;
--font-weight-bold:    680;
```

## Border Radius

```css
--radius-4:       4px;
--radius-6:       6px;
--radius-8:       8px;   /* carduri mici */
--radius-12:      12px;  /* carduri principale */
--radius-16:      16px;
--radius-24:      24px;  /* modals */
--radius-32:      32px;
--radius-rounded: 9999px; /* badges, pills */
```

## Spacing / Layout

```css
--header-height:        72px;
--header-blur:          20px;
--page-padding-inline:  24px;
--page-padding-block:   64px;
--page-max-width:       1024px;
--prose-max-width:      624px;
--page-inset:           32px;
```

## Z-index Scale

```css
--layer-tooltip:      1100;
--layer-dialog:        700;
--layer-command-menu:  650;
--layer-popover:       600;
--layer-header:        100;
--layer-footer:         50;
```

## Umbre

```css
--shadow-low:    0px 2px 4px rgba(0,0,0,0.1);
--shadow-medium: 0px 4px 24px rgba(0,0,0,0.2);
--shadow-high:   0px 7px 32px rgba(0,0,0,0.35);
```

## Animații

```css
--speed-quickTransition:   0.1s;
--speed-regularTransition: 0.25s;
```

---

## Tema Dark (aplicație)

```css
/* Backgrounds */
--color-bg-primary:       #08090a;   /* fundal principal */
--color-bg-secondary:     #1c1c1f;   /* sidebar, panels */
--color-bg-tertiary:      #232326;   /* hover states */
--color-bg-quaternary:    #28282c;   /* carduri */
--color-bg-panel:         #0f1011;
--color-bg-translucent:   rgba(255,255,255,0.05);

/* Layere (suprafețe suprapuse) */
--color-bg-level-0: #08090a;
--color-bg-level-1: #0f1011;
--color-bg-level-2: #141516;
--color-bg-level-3: #191a1b;

/* Borders */
--color-border-primary:              #23252a;
--color-border-secondary:            #34343a;
--color-border-tertiary:             #3e3e44;
--color-border-translucent:          rgba(255,255,255,0.05);
--color-border-translucent-strong:   rgba(255,255,255,0.08);

/* Text */
--color-text-primary:    #f7f8f8;   /* text principal */
--color-text-secondary:  #d0d6e0;   /* text secundar */
--color-text-tertiary:   #8a8f98;   /* text slab, labels */
--color-text-quaternary: #62666d;   /* placeholder, disabled */

/* Brand / Accent */
--color-brand-bg:    #5e6ad2;   /* indigo Linear */
--color-accent:      #7170ff;
--color-accent-hover: #828fff;
--color-accent-tint:  #18182f;

/* Links */
--color-link-primary: #828fff;
--color-link-hover:   #fff;

/* Header */
--header-bg:     rgba(11,11,11,0.8);   /* blur + transparent */
--header-border: rgba(255,255,255,0.08);
```

---

## Cum aplicăm în proiect (globals.css)

```css
@import "tailwindcss";

:root {
  --background:    0 0% 3%;       /* #08090a */
  --foreground:    210 11% 97%;   /* #f7f8f8 */
  --card:          240 3% 11%;    /* #1c1c1f */
  --card-foreground: 210 11% 97%;
  --border:        240 4% 15%;    /* #23252a */
  --input:         240 4% 15%;
  --primary:       237 52% 60%;   /* #5e6ad2 */
  --primary-foreground: 0 0% 100%;
  --secondary:     240 4% 13%;    /* #1c1c1f */
  --muted:         240 4% 15%;
  --muted-foreground: 218 8% 51%; /* #8a8f98 */
  --accent:        239 100% 72%;  /* #7170ff */
  --radius: 0.5rem;               /* ~8px */

  --font-sans: "Inter Variable", system-ui, sans-serif;
}
```

---

## Principii vizuale extrase

1. **Backgrounds aproape negre** dar nu #000 — #08090a are o căldură subtilă
2. **Border-uri ultra-subtile** — opacity 5-8% pe alb, nu gri solid
3. **Accent indigo** (#5e6ad2) folosit rar — doar pe butoane principale și focus
4. **Text hierarchy în 4 trepte** — primary/secondary/tertiary/quaternary
5. **Header blur** — `backdrop-filter: blur(20px)` cu background semi-transparent
6. **Radius consistent** — 8px pentru elemente mici, 12px pentru carduri
7. **Umbre minimaliste** — doar 3 nivele, negru pur fără culoare
8. **Font weight non-standard** — Inter Variable cu 510/590/680 în loc de 500/600/700

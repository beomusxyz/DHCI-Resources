# DHCI-Resources

Greetings. Everything's in here. Don't skip the comments in the HTML — that's where the actual implementation notes live.

---

## Files & Structure

```
DHCI-Resources/
├── Wireframes/
│   ├── nts_wireframes_sarah.html     Sarah Smith — Student screens (WP2)
│   ├── nts_wireframes_brown.html     Dr Michael Brown — Lecturer screens (WP3)
│   ├── nts_wireframes_ruby.html      Ruby Jones — Admin screens (WP4)
│   └── fonts/                        TX-02 (Berkeley Mono) — full family
├── Spec-Documents/
│   ├── nts_component_library.html    Every component, rendered and annotated
│   ├── nts_design_reference.html     Tokens, spacing grid, colour system, screen anatomy
│   └── fonts/                        TX-02 (Berkeley Mono) — full family
└── HI-Fi Resources/
    ├── styles.css                    Shared stylesheet
    ├── nts.js                        Shared JS
    └── nts_snippets.html             Hi-fi component snippets
```

Just open the HTML files in a browser. No build step.

---

## Hi-Fi Resources

These three files are everything needed to build the hi-fi prototype. Don't rewrite any of it — just use it. Unless you want to fuck with idk, i'm not your dad. Can't tell you what to do.

- **`styles.css`** — full design system as a single stylesheet. Link it and all tokens, components, dark mode, and typography rules are available. Every colour pairing in it is WCAG 2.1 AAA-verified. Don't introduce arbitrary hex values; use the tokens.
- **`nts.js`** — minimal behaviour shim. Handles three things: dark mode toggle (persists to `localStorage`), toast auto-dismiss after 4s, and modal focus trap. Everything else in the design is CSS-only. Defer it.
- **`nts_snippets.html`** — copy-paste component markup. Open it in a browser, find the component you need, copy the HTML, paste it into your prototype. Requires `styles.css` and `nts.js` to render correctly.

Wire-up is two lines:

```html
<link rel="stylesheet" href="path/to/styles.css">
<script src="path/to/nts.js" defer></script>
```

The fonts need to be in a `fonts/` directory at the same path level as `styles.css`. They're already there in the repo — just keep the folder structure intact.

You are welcome sir.

---

## Personas

| Persona | Role | Accent | Screens |
|---|---|---|---|
| Sarah Smith | Student | Blue `#1A5FA8` | LG-01, ST-01–ST-06 |
| Dr Michael Brown | Lecturer | Green `#2D6B1F` | LG-01, LC-01–LC-08 |
| Ruby Jones | Admin | Red `#A82020` | LG-01, AD-01–AD-10 |

All three share LG-01 (login) and the same layout grammar. Persona accent is just a token swap — `--color-student` / `--color-lecturer` / `--color-admin`. One component, three personas, don't hardcode hex.

---

## Screens

**Sarah (Student):** Dashboard (ST-01), Module List (ST-02), Module Detail (ST-03), Session Entry modal (ST-04), VR HUD (ST-05), Desktop fallback (ST-05b), Post-session feedback (ST-06).

**Dr Brown (Lecturer):** Dashboard (LC-01), Student List (LC-02), Group Assignment (LC-03), Module Manager (LC-04), Live Monitor (LC-05), Observer view (LC-06), Report (LC-07), Comms Panel (LC-08).

**Ruby (Admin):** Dashboard (AD-01), Issues (AD-02), Diagnostics (AD-03), Device Detail (AD-04), Firmware manager (AD-05), Loans (AD-06), Attendance (AD-07), Collab hub (AD-08), Logs (AD-09), Comms Panel (AD-10).

---

## Design system

Read `Spec-Documents/nts_design_reference.html` first. It has everything: screen anatomy, spacing, colour tokens, typography scale.

**Font — TX-02 (Berkeley Mono).** Don't substitute. Rules:
- Retina weight for 11px and below
- Condensed for VR HUD panels (ST-05) only
- SemiCondensed for data tables
- Regular/Medium/Bold everywhere else

**Spacing — 8px grid.** `--sp1`=4px, `--sp2`=8px, `--sp3`=12px, `--sp4`=16px, `--sp6`=24px, `--sp8`=32px.

**Dark mode** — `[data-theme="dark"]` on `<body>`, all tokens remap. Never hardcode hex in component styles.

**WCAG 2.1 AAA.** I hate UI/frontend, and if I have to do it, I'm doing it by the fucking book. Every text/background combination passes AAA. Accent colours on white need the paired `-bg` token (`--color-student-bg`, etc.) to get there — don't skip this.

---

## Components

All in `Spec-Documents/nts_component_library.html`. Buttons are persona-scoped: `.btn-student`, `.btn-lecturer`, `.btn-admin`. The toggle uses CSS `:has(input:checked)` — no JS. HUD panels use `backdrop-filter: blur(4px)` with a semi-opaque fallback already defined (verify it works in your VR browser). Every element inside a HUD panel inherits `--font-condensed` — all of them.

---

## MONIL: warnings

Critical implementation notes are flagged `MONIL:` in the comments throughout every file.

Covers: browser support caveats, interaction states that need animating, required CSS properties, accessibility gotchas, component class names.

Also wrap every animation in `prefers-reduced-motion`. It's in the comments. Don't skip it.

---

Questions? The annotation callouts and CSS comments explain most decisions. If something still doesn't make sense, ask.


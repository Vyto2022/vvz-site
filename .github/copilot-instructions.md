<!--
Short, actionable instructions for AI coding agents working on this repository.
Keep this file under ~50 lines and update when conventions change.
-->
# Copilot instructions — VVZ Studio static landing pages

- **Purpose:** Small static marketing site (HTML/CSS/JS) for local landing pages and case examples. No build step; files are served as-is.

- **Key files:** [index.html](index.html) (main page), [style.css](style.css) (site styles), [script.js](script.js) (tiny DOM helpers), case pages: `case-auto.html`, `case-detailing.html`, `case-tires.html`.

- **Project shape / architecture:**
  - Static multi-page site (single-page sections on `index.html` + separate case pages).
  - Minimal JS. Most behavior is layout and markup-driven.
  - Icons are embedded as SVG <symbol> in `index.html`.
  - Contact form posts to Formspree (action on the form in `index.html`).

- **Conventions & patterns:**
  - Container class: `.c` used for centered content.
  - Cards: `.card` for content blocks (used throughout sections).
  - Grid: `.grid3` for 3-column responsive layouts; utility spacing like `mt-14`.
  - Buttons: `.btn`, `.btnP`, `.btnIcon` variants.
  - Semantic anchors: section ids correspond to nav links (e.g., `#work`, `#contact`).
  - Small inline styles exist for one-off overrides (avoid changing unless necessary).

- **Common edits & examples:**
  - Change hero headline: edit the `<h1 class="hero-title">` in [index.html](index.html).
  - Update form fields / endpoint: edit the `<form id="quoteForm">` block in [index.html](index.html).
  - Add a new case: create `case-<name>.html` mirroring existing case pages and link from the `Work` grid in [index.html](index.html).

- **Dev workflow / commands:**
  - No build required. Test locally with a simple static server, e.g. `python -m http.server 8000` or `npx serve` from repo root.
  - For quick CSS/HTML iteration, use a live-reload server in your editor or `live-server`.

- **Integration points / external deps:**
  - Form submission: Formspree (check the `action` attribute on the quote form).
  - External CTAs: Telegram / WhatsApp / mailto links in the contact area.
  - Favicon and Open Graph images referenced from root (e.g., `favicon.png`, `og.png`).

- **Testing & debugging notes:**
  - No automated tests. Validate changes by serving the site and checking: navigation links, responsive layout (mobile-first), form submission flow.
  - Use browser devtools for layout (grid/card spacing) and to verify SVG symbols load.

- **When making PRs:**
  - Keep changes focused and minimal (style tweaks separate from content changes).
  - Include a screenshot of before/after for visual changes.

If anything in this file is unclear or you want more examples (CSS patterns, script responsibilities), tell me what to expand.

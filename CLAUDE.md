# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for **Niveditha S**, a professional wall muralist based in India. The live site is deployed on GitHub Pages at `https://niveditha-s4.github.io/artist-portfolio/`. No backend — pure static HTML/CSS/JS.

## Development

There is no build system, package manager, or test suite. To develop:

- **Preview locally:** Open `index.html` directly in a browser, or use a live-server extension (e.g. VS Code Live Server) to avoid CORS issues with assets.
- **Deploy:** Push to the `main` branch. GitHub Pages auto-deploys from the repo root.
- **No linting or compile step.** Changes to `index.html`, `style.css`, or `script.js` are immediately effective on reload.

## Architecture

This is a single-page application with all content in `index.html`. The three source files are tightly coupled — understand their relationships before editing.

### `index.html`
Seven sections in order: `#hero` → `#about` → `#portfolio` → `#mural-planner` → testimonials → `#faq` → `#contact`. The file also contains five JSON-LD structured data blocks in `<head>` (WebSite, Person, LocalBusiness, FAQPage, ItemList) — keep these in sync with any content changes.

The portfolio gallery uses `data-category` attributes (`residential`, `accent`, `commercial`) on `.portfolio-item` divs. Each gallery image trigger has a `data-target` attribute (e.g. `img1`) that must match the corresponding entry in the `galleryItems` array in `script.js`. **Adding or removing a portfolio item requires updating both the HTML and the `galleryItems` array.**

### `style.css`
All brand tokens are CSS custom properties in `:root`. The primary accent is `--accent: #C3A478`. Three font stack variables are used consistently: `--font-heading` (Syne/Plus Jakarta Sans — for nav, labels, caps), `--font-serif` (Newsreader/Playfair Display — for headings and editorial copy), `--font-body` (Plus Jakarta Sans/Inter — body text). Anthropic fonts are also loaded via CDN and mapped first in these stacks.

Responsive breakpoints: 1100px (2-col gallery), 991px (stacked grid), 768px (mobile nav + hero override), 576px (stat cards stack). The hero section background position is overridden at ≤768px to show the artist's face on the right side — do not remove the mobile override in the hero `::before` pseudo-element.

### `script.js`
All interactivity is in a single `DOMContentLoaded` listener. Key systems:

- **Hero animation:** CSS animations are `paused` by default; `script.js` adds `.hero-animate` to `#hero` after the preloader fades out (~800ms after `window.load`).
- **Scroll reveal:** `IntersectionObserver` adds `.active` to `.scroll-reveal`, `.animate-slide-in-left`, `.animate-slide-in-right`. The about section counter (`data-val` attributes) is triggered when `#about` intersects.
- **Mural estimator:** Reads `data-rate` from the active `.style-card` and input values to compute price. The visualizer swaps `background-image` on `.canvas-artwork` to match the selected style.
- **Lightbox:** The `galleryItems` array (line ~314) holds metadata for each image. `data-target` on `.lightbox-trigger` elements indexes into this array.
- **EmailJS:** Credentials are hardcoded at lines 437–439 (`EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`). If any is left as a placeholder string, the form falls back to demo mode automatically.

### `Assets/`
All images referenced directly by relative path. Image filenames contain spaces — always quote paths in any tooling context. The hero background is `Assets/Front page.png` (also preloaded in `<head>`).

## Design Guidelines

- **Accent color `#C3A478`** (brushed gold) is the single brand color — use it for highlights, icons, and interactive states only.
- Background surfaces: `#FBFBFA` (light), `#F4F2EC` (secondary), `#151413` (dark sections like the planner). Do not introduce new background colors.
- The custom cursor (`cursor: none` on `*`) is disabled automatically on touch devices via `@media (hover: none) and (pointer: coarse)`. Any new interactive element should be added to the `interactiveElements` selector in `script.js` to receive cursor hover states.
- All SEO metadata (canonical URL, Open Graph, structured data) references `https://niveditha-s4.github.io/artist-portfolio/`. Update consistently if the domain changes.

## Content & Tone

- Copy is warm and artist-first — avoid corporate or transactional language.
- Pricing tiers: Minimalist ₹80/sq.ft · Detailed ₹150/sq.ft · Narrative ₹350/sq.ft. These appear in the HTML, JSON-LD FAQ schema, and the `data-rate` attributes on style cards — update all three together.
- Contact: `nivisun4@gmail.com` · `+91 86672 10067` · Instagram: `@nivi___1912`

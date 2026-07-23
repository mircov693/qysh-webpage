# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static marketing + legal website for the QYSH mobile app (iOS/Android), a tobacco/nicotine reduction tracker with optional Bluetooth integration for IQOS devices. Deployed via GitHub Pages to `qysh.mircov.de` (see `CNAME`). No backend, no build system, no package manager — plain HTML/CSS/JS served as-is.

## Development

There is no build/lint/test tooling. To work on the site locally, serve the directory with any static file server and open it in a browser, e.g.:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`. Force a specific language for testing via the `?lang=de|en|ru` query param, or use the language `<select>` in the footer.

Validate JSON language files after editing (no linter is configured):

```
python3 -c "import json; json.load(open('languages/de.json'))"
```

## Architecture

### Pages

Each top-level page is its own directory with an `index.html` (`/`, `/privacy/`, `/terms/`, `/legal/`). Sub-pages reference shared assets with a `../` prefix (`../style.css`, `../script.js`, `../images/QYSHIcon.png`). All pages duplicate the same `<nav>`, footer, and `footer-links` block by hand — there is no templating, so structural nav/footer changes must be applied to every `index.html` individually.

### i18n system (`script.js` + `languages/*.json`)

- Supported languages are hardcoded in `script.js` as `SUPPORTED_LANGUAGES = ['de', 'en', 'ru']`.
- Translatable elements carry a `data-i18n="key"` attribute; `updateContent()` looks the key up in the fetched language JSON and sets `element.innerHTML`.
- Language resolution order on load: `?lang=` query param → `localStorage['language']` → `'en'` fallback.
- **Every `data-i18n` key must exist with matching content in all three of `languages/de.json`, `languages/en.json`, and `languages/ru.json`.** Keys must stay in sync across files (same key set) — check this after editing.
- The literal text inside each `data-i18n` element in the HTML is the pre-JS fallback (shown briefly before `updateContent()` swaps in the fetched language) and should be kept in sync with the English (`en.json`) value for that key — when adding/changing a key's content, update the HTML fallback text too, not just the JSON files. Since this text is raw HTML (not JSON), use plain `"` quotes there, not JSON-escaped `\"`.
- The `legal/index.html` page has a special case: `fetchDisclaimerEn()` always shows an English version of the IQOS disclaimer (`iqos-disclaimer-en-container`) alongside the active language, for legal-notice reasons — don't remove this without checking why it's there.
- App Store / Google Play badges (`badges/apple/{lang}.svg`, `badges/google/{lang}.svg`) are swapped per-language by `updateBadges()`.

### Legal content (`privacy/`, `terms/`, `legal/`)

- Provider/data controller: Vladimir Cabacov (mircov), Germaniastr. 30, 40223 Düsseldorf, Germany — `info@mircov.de`. Governed by German law/GDPR; competent supervisory authority is LDI NRW.
- The app stores all user data locally on-device (no backend server). Paid access is via subscriptions (monthly/annual/lifetime) billed exclusively through the Apple App Store / Google Play — no custom payment backend, no third-party subscription SDK (e.g. no RevenueCat).
- IQOS is a Philip Morris Products S.A. trademark; the app/provider has no affiliation — this disclaimer must stay intact in `legal/index.html`.
- Minimum age for app use is 18 (tobacco-related content).
- `versions.json` (`terms_version`, `privacy_version`) is read by the app to detect when it must prompt users to re-accept updated legal docs. **The app has not shipped yet (first version still in development) — do not increment these version numbers until the user confirms the app is live.** Editing the legal page content itself is fine at any time.

### Styling

Single global `style.css` using CSS custom properties defined on `:root` (`--button-color`, `--cyan-color`, etc.) and nested selectors (native CSS nesting, no preprocessor).

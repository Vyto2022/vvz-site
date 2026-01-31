# VVZ Studio — Static Landing (Google Sheets ready)

This is a **pure static** website that works on:
- localhost (Python http.server)
- GitHub Pages

✅ Lead form is configured for **Google Sheets** (via **Google Apps Script Web App**).

---

## Run locally
```bash
python3 -m http.server 8000
# open http://127.0.0.1:8000/
```

---

## Connect the form to Google Sheets (required)
A static site cannot write to Google Sheets directly. We use a tiny **Google Apps Script Web App**.

### 1) Create the sheet + Apps Script
1. Create a Google Sheet (any name). Recommended tab name: **Leads**.
2. In the same sheet: **Extensions → Apps Script**.
3. Paste the code from `google-apps-script.js`.
4. Save.

### 2) Deploy as Web App
1. Click **Deploy → New deployment**
2. Select **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy, then copy the URL (it ends with `/exec`).

### 3) Paste the URL into the website
Open `script.js` and set:
```js
googleScriptUrl: 'PASTE_YOUR_GOOGLE_SCRIPT_URL_HERE',
```
Replace it with your real Apps Script URL.

> Tip: you only need to edit `script.js` once.

### 4) Test
Open the site, submit the form. You should see a new row in the **Leads** sheet.

---

## What to edit for your business
- WhatsApp link in `index.html`, `index-fr.html`, `index-ru.html`:
  - Replace `https://wa.me/33XXXXXXXXX` with your real number (digits only, no `+`, no spaces)
- Telegram username and email where needed.

---

## Files
- `index.html` (EN), `index-fr.html` (FR), `index-ru.html` (RU)
- `style.css` (shared styles)
- `script.js` (form submit + redirect to `thanks.html`)
- `case-*.html` + `case.css`
- `thanks.html`
- `google-apps-script.js` (copy-paste into Apps Script)


## Assets
All images are in the `IMG/` folder (favicon, webclip, OG image, logo, and placeholders).

# VVZ Studio — static site (ready to push)

This folder is a **clean, fixed** version of your VVZ Studio landing in **EN / FR / RU**.

## What was fixed (compared to the current published version)
- ✅ **No placeholders** (removed "Trusted by 20+...", fake testimonials, "replace link..." notes)
- ✅ **WhatsApp fixed for FR** (no more `33XXXXXXXXX`)
- ✅ **Email is clickable** (mailto link) + contact form opens an email draft (no backend required)
- ✅ **FR/RU layout is identical** to EN (same grid + same sections)
- ✅ **Work section has real demo pages** + case pages (no more "replace later")

## Files
- `index.html` (EN)
- `index-fr.html` (FR)
- `index-ru.html` (RU)
- `style.css`
- `script.js`
- `demo-auto.html`, `demo-detailing.html`, `demo-tires.html`
- `case-auto.html`, `case-detailing.html`, `case-tires.html`
- `IMG/` (images used by the cards + proof)

## Change contacts (one time)
Search in **any** `index*.html`:
- WhatsApp: `https://wa.me/33605997424`
- Telegram: `https://t.me/vyto1501`
- Phone: `+33605997424`
- Email: `vyto1501@gmail.com`

## Deploy (GitHub Pages)
In your repo folder:
```bash
# copy/replace files from this archive into your repo
# then:
git add .
git commit -m "Fix FR/RU layout + links, remove placeholders"
git push
```

If your GitHub Pages is set to `/vvz-site/` it will pick up the new `index.html` automatically.

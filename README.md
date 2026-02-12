# Howell Forge Website

Backup, restore, and deploy source for https://howell-forge.com

## Contents

- **index.html** — Main site (React + Web3 wallet connect, Home/About/Contact)
- **.htaccess** — IONOS-compatible SPA routing (fixes 500 on /about, /contact)

## Deploy to IONOS

### Option 1: IONOS Deploy Now (GitHub → IONOS)

1. Log in to [IONOS](https://www.ionos.com)
2. Go to **Deploy Now** or **Websites & Apps** → your domain
3. Connect this GitHub repo: `ariesfiredragonfu/howell-forge-website`
4. Select branch `main`
5. Deploy — IONOS will build and push to your hosting
6. Future changes: push to GitHub → auto-deploys

### Option 2: Manual upload (File Manager / FTP)

1. Download or clone this repo
2. Upload `index.html` and `.htaccess` to your IONOS web root (e.g. `public_html`)
3. Overwrite existing files

## Local development

From `~/Desktop`:

```bash
cd ~/Desktop && python3 serve_site.py
```

Then open http://localhost:8000

## .htaccess fix

The `.htaccess` file has `Options +FollowSymLinks` removed (it causes 500 errors on IONOS). The rewrite rules send `/about` and `/contact` to `index.html` so the React app can handle routing.

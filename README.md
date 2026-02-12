# Howell Forge Website

Backup, restore, and deploy source for https://howell-forge.com

## Contents

- **index.html** — Main site (React + Web3 wallet connect, Home/About/Contact)
- **.htaccess** — IONOS-compatible SPA routing (fixes 500 on /about, /contact)

## Connecting GitHub to IONOS (Deploy Now)

1. Log in to [IONOS](https://www.ionos.com)
2. Go to **Websites & Apps** → select your howell-forge.com site (or create one)
3. Look for **Deploy Now** or **Git** / **GitHub** integration
4. Connect your GitHub account (authorize IONOS if prompted)
5. Choose repo: **ariesfiredragonfu/howell-forge-website**
6. Branch: **main**
7. Set deployment path to your web root (e.g. `public_html`)
8. Save and deploy — IONOS will pull from GitHub and serve the files
9. Future changes: push to GitHub → IONOS auto-deploys

## Manual deploy (if Deploy Now isn't set up yet)

1. Download or clone this repo
2. Upload `index.html` and `.htaccess` to your IONOS web root (e.g. `public_html`) via File Manager or FTP
3. Overwrite existing files

## Local development

From `~/Desktop`:

```bash
cd ~/Desktop && python3 serve_site.py
```

Then open http://localhost:8000

## .htaccess fix

The `.htaccess` file has `Options +FollowSymLinks` removed (it causes 500 errors on IONOS). The rewrite rules send `/about` and `/contact` to `index.html` so the React app can handle routing.

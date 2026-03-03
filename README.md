# Howell Forge Website

Backup, restore, and deploy source for https://howell-forge.com

## Deploy (current setup)

IONOS Deploy Now / Docker isn’t available on the current hosting plan. The site is deployed to **GitHub Pages** for now. See **[DEPLOY_OPTIONS.md](DEPLOY_OPTIONS.md)** for the full picture (GitHub Pages vs laptop+tunnel vs future IONOS VPS).

**One-time:** Repo **Settings → Pages** → Source: **Deploy from a branch** → branch **gh-pages** → folder **/ (root)**. After the next successful build, the site is at `https://<username>.github.io/howell-forge-website/` (or your custom domain if set).

## Contents

- **index.html** — Main site (React + Web3 wallet connect, Home/About/Contact)
- **.htaccess** — IONOS-compatible SPA routing (fixes 500 on /about, /contact)

## Connecting GitHub to IONOS (Deploy Now) — *paused*

*Deploy Now requires an IONOS plan that supports Docker; current plan doesn’t. Using GitHub Pages until you add an IONOS VPS or change plan. See [DEPLOY_OPTIONS.md](DEPLOY_OPTIONS.md).*

## Manual deploy (if you have FTP / File Manager on IONOS)

If your IONOS plan allows uploads to web root: download or clone this repo, upload `index.html`, `.htaccess`, and the `gcf/` folder (from a successful Actions build artifact) to your web root. Otherwise use GitHub Pages; see [DEPLOY_OPTIONS.md](DEPLOY_OPTIONS.md).

## Local development

From `~/Desktop`:

```bash
cd ~/Desktop && python3 serve_site.py
```

Then open http://localhost:8000

## .htaccess fix

The `.htaccess` file has `Options +FollowSymLinks` removed (it causes 500 errors on IONOS). The rewrite rules send `/about` and `/contact` to `index.html` so the React app can handle routing.

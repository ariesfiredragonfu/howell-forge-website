# Deploy options (current plan)

## Current constraint

**IONOS Deploy Now (Docker)** and **VPS/SSH/SFTP** are not available on the current IONOS hosting contract. So we can’t use the “Deploy to IONOS” workflow or upload via SSH/SFTP to IONOS until the plan is upgraded.

**Plan:** Use a free “for now” host until there’s revenue, then add an IONOS VPS (or similar) like you did for the other project.

---

## Option A: GitHub Pages (recommended “for now”)

- **What:** The same build that runs in Actions also deploys the built site to GitHub Pages.
- **Cost:** Free.
- **URL:** `https://<username>.github.io/howell-forge-website/` (or a custom domain if you add it in repo Settings → Pages).
- **How:** Push to `main` → build runs → site is deployed to the `gh-pages` branch → GitHub serves it. No laptop needed.

**One-time setup:** In the repo **Settings → Pages**, set **Source** to “Deploy from a branch”, branch **gh-pages**, folder **/ (root)**. Save. After the next successful build, the site will be live at the GitHub Pages URL.

---

## Option B: Laptop + tunnel

- **What:** Build on GitHub (or locally), run a static server on your machine, expose it with a tunnel (e.g. Cloudflare Tunnel, ngrok).
- **Cost:** Free tier of the tunnel service.
- **Trade-off:** The site is only up when your laptop is on and the tunnel is running. Good for demos or “until we have a server.”

---

## Later: IONOS VPS

When you’re ready to pay for a VPS on IONOS (same path as the other project):

- Point the domain to the VPS.
- Deploy by building in GitHub and pushing to the VPS via SSH, or run the static site in a small server (e.g. nginx) on the VPS.

---

## Summary

| Option           | Cost   | Laptop needed? | Good for              |
|------------------|--------|----------------|------------------------|
| **GitHub Pages** | Free   | No             | Live site “for now”   |
| **Laptop+tunnel** | Free | Yes            | Demos / temporary     |
| **IONOS VPS**    | Paid   | No             | Later, when revenue   |

The workflow is set up to **build** and **upload the artifact to IONOS** (for when you have a compatible plan) and to **deploy to GitHub Pages** so the site is live without IONOS or your laptop.

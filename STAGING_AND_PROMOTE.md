# Staging, backups, and promote to live (GitHub Pages)

**Facts**

- **GitHub Pages** for this repo deploys from **`main`** only (see `.github/workflows/deploy-github-pages.yaml`).
- The **`staging`** branch may **lag** `main`; sync it before treating staging as a preview base.

---

## Before you change the live site

1. **Tag `main`** (restore point without copying files):
   ```bash
   git fetch origin && git checkout main && git pull origin main
   git tag backup/main-pre-change-$(date +%Y%m%d-%H%M)
   git push origin backup/main-pre-change-$(date +%Y%m%d-%H%M)
   ```
2. **Optional file copy** (like existing `backups/`):
   ```bash
   cp index.html "backups/index-pre-change-$(date +%Y%m%d-%H%M).html"
   git add backups/ && git commit -m "chore: backup index before …"   # only if you want backups in git
   ```

---

## Recommended flow for a new page (e.g. funnel)

1. `git checkout main && git pull`
2. Create **restore tag** (above).
3. Add or edit files; **test locally**:  
   `python3 -m http.server 8899` → open `http://127.0.0.1:8899/funnel-gcf.html` (pick a **free** port; see Hardware_Factory port rules).
4. Commit on a **feature branch** or directly on `main`:
   ```bash
   git checkout -b feature/funnel-gcf   # optional
   git add funnel-gcf.html
   git commit -m "feat: GroundChiFlow acquisition funnel page"
   ```
5. **Push** → `main` triggers **Deploy to GitHub Pages**. Wait for Actions green.
6. Verify **https://howell-forge.com/funnel-gcf.html** (and `index.html` unchanged in intent).

---

## Using `staging` branch

If you want **`staging`** as integration branch:

```bash
git checkout staging
git merge main -m "sync: merge main into staging"
# resolve conflicts if any; then merge feature or commit here
git push origin staging
```

**Preview:** There is **no** automatic Pages deploy for `staging` with the current workflow. Options: **local server**, **fork + Pages on fork**, or add a **separate workflow** for `staging` (future work).

---

## Rollback

```bash
git checkout main
git reset --hard backup/main-pre-change-YYYYMMDD-HHMM   # use your tag name
git push origin main --force   # only if you must revert remote — coordinate first
```

Or restore a single file from `backups/` in the repo.

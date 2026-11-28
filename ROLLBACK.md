# Rolling back howell-forge.com (GitHub Pages)

This site deploys automatically when **`main`** is updated: the **Deploy to GitHub Pages** workflow builds and publishes to howell-forge.com. Any push to `main` (including merges and reverts) triggers a new deploy.

## Restore-point tags

List live restore tags:

```bash
git tag -l 'live-*'
```

Recent go-live tags (2026-10-04):

| Tag | Purpose |
|-----|---------|
| `live-2026-10-04-pre-portfolio` | Site **before** `/portfolio/` and `/contact/` (PR #12). |
| `live-2026-10-04-portfolio` | Site **after** PR #12 merged to `main`. |

Each tag has a matching GitHub **Release** with the same name for easy browsing in the UI.

## Preferred rollback: revert on `main` (no force-push)

Use this when you want a clear audit trail and a normal merge deploy.

1. Identify the merge commit to undo (e.g. PR #12 merge).
2. On an up-to-date `main`:

   ```bash
   git fetch origin
   git checkout main
   git pull origin main
   git revert -m 1 <merge-commit-sha>
   git push origin main
   ```

3. Wait for **Deploy to GitHub Pages** to finish on GitHub Actions.
4. Verify https://howell-forge.com/ (and any paths you care about).

To roll forward again, merge or revert the revert commit the same way.

## Alternative: deploy a known `live-*` tag via `main`

If you need the tree exactly as a tag (not just undoing one merge):

1. Create a branch from the tag, open a PR into `main`, and merge (merge commit recommended if you want to preserve history).
2. Or, with owner approval only, reset `main` to the tag and force-push (see emergency path below).

Tags alone do **not** deploy; **`main`** must point at the commit you want live.

## Emergency path: reset or force-push to a `live-*` tag

**Only with explicit owner (Chris) approval.** This rewrites `main` history and affects anyone else working on the repo.

```bash
git fetch origin --tags
git checkout main
git pull origin main
git reset --hard live-2026-10-04-pre-portfolio   # example: pre-go-live
git push --force-with-lease origin main
```

Then confirm the Pages deploy workflow succeeds. Use `--force-with-lease`, not a blind `--force`, when possible.

## Backup branches

Long-lived pointers at restore commits (same SHA as the matching tag when created together):

- `backup/live-2026-10-04-pre-portfolio` — pre–PR #12 site.

These branches are for reference and PRs; they do not deploy until merged into `main`. **Do not merge documentation-only PRs** (e.g. updates to this file) if the only goal is to change docs without redeploying—but note that **any** merge to `main` still runs the full Pages deploy with whatever is currently on `main`.

## After rollback

- Confirm HTTP 200 on `/`, `/portfolio/`, `/contact/` as appropriate for the restored version.
- Allow a few minutes for CDN/cache if content looks stale.
- Create a new annotated `live-*` tag on the restored `main` HEAD if you want a named restore point for that state.

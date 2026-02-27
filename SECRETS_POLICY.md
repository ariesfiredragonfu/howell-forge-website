# Secrets policy — howell-forge-website

**Do not commit API keys, passwords, or other secrets to this repo.**

- Use **environment variables** locally (e.g. `.env` with `.env` in `.gitignore`).
- Use **GitHub Actions secrets** in CI (e.g. `EXPO_PUBLIC_FIREBASE_API_KEY` for GroundChiFlow).
- **Build output** that inlines config (e.g. `groundchiflow/_expo/`) must **not** be committed; build in CI and deploy the artifact.
- The **secret-scan** workflow fails the build if patterns like `AIza...` or `GOCSPX...` are found in committed files.

If you need a key in the app (e.g. Firebase for GroundChiFlow), put it in a **private gate**: env at build time or a server-side config, never in the repo.

# Where to find the secrets (GroundChiFlow build)

The build needs several **secrets** in GitHub so it can build GroundChiFlow without putting the Firebase key in the repo. You **add** these in GitHub; the values come from **Firebase** and **GitLab**.

**Full step-by-step (where to click, what to copy):**  
In the **Hardware_Factory** repo, open **`docs/WHERE_TO_FIND_SECRETS.md`**. It walks through:

1. **Firebase** — https://console.firebase.google.com/ → your GroundChiFlow project → Project settings → Your apps → Web app config. Copy each value into the matching GitHub secret name.
2. **GitLab** — https://gitlab.com/ariesfiredragonfu/ground-chi-flow/-/settings/access_tokens → create a token with **read_repository** → copy it; that’s **GITLAB_TOKEN** in GitHub.
3. **GitHub** — https://github.com/ariesfiredragonfu/howell-forge-website/settings/secrets/actions → **New repository secret** for each name below; paste the value.

**Secret names to add:**

| Name | Get value from |
|------|----------------|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Firebase Web app config → apiKey |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase → authDomain |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | Firebase → projectId |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase → storageBucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase → messagingSenderId |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | Firebase → appId |
| `GITLAB_TOKEN` | GitLab Access Token (read_repository) |
| `EXPO_PUBLIC_GROK_BRIDGE_URL` | Optional: `https://grok.howell-forge.com` |

**If the app already runs locally:** open `~/GroundChiFlow/.env` and copy each `EXPO_PUBLIC_*` name and value into GitHub Secrets (same names). You still need to create **GITLAB_TOKEN** in GitLab.

**Full session summary (what we did for safe restore, gcf/, deploy, errors):** In the **Hardware_Factory** repo, see **`docs/GROUNDCHIFLOW_RESTORE_SESSION.md`**.

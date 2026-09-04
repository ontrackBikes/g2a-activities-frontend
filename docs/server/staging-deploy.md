# Staging Deploy

How pushing to the `staging` branch gets the app onto the staging server.

## Trigger

Any push to the `staging` branch runs `.github/workflows/deploy-staging.yml`. There is no manual step — merge or push to `staging` and it deploys.

```bash
git checkout staging
git merge main   # or push commits directly
git push origin staging
```

## What the workflow does

1. Checks out the repo, installs dependencies (`npm ci`).
2. Writes `.env.production` from the GitHub **staging** Environment's secrets.
3. Builds the main app: `npm run build:production`.
4. Builds the generic widgets (booking-price, product-list): `npm run build:widgets`.
5. SSHes into the staging server and `rsync --delete`s the local `dist/` folder to the server's `dist/` folder.

The build always runs in **production mode** (`build:production`), even though it's deploying to staging — the staging vs. production distinction comes entirely from which secrets get written into `.env.production`, not from a different Vite mode.

## Server details

| | |
|---|---|
| Host | `168.144.16.172` |
| SSH user | `shrenik` |
| Deploy path | `/var/www/staging/g2a-activities-frontend/dist` |
| Site | https://activities-test.go2andaman.com |

**The `/dist` suffix on the deploy path is required.** Nginx's `root` for `activities-test.go2andaman.com` points at `.../g2a-activities-frontend/dist`, not at `.../g2a-activities-frontend` itself. Rsyncing to the wrong (parent) path with `--delete` will wipe the live document root and take the site down with a 500 error until corrected — this happened once during setup. If the deploy path ever needs to change, check the server's nginx config first:

```bash
ssh -i ~/.ssh/id_rsa shrenik@168.144.16.172 \
  "cat /etc/nginx/sites-available/activities-test.go2andaman.com"
```

## Required GitHub configuration

**Environment secrets** — under Settings → Environments → `staging` (repo: `ontrackBikes/g2a-activities-frontend`), as **Environment secrets**, not Environment variables:

- `VITE_API_BASE_URL` — `https://activities-test.go2andaman.com/api` (no `/v1` — the app appends that itself on every call)
- `VITE_BASE_URL` — `https://activities-test.go2andaman.com`
- `VITE_RAZORPAY_KEY_ID` — the test Razorpay key

**Repository secret** (shared with the production workflow, not environment-scoped):

- `DEPLOY_SSH_KEY` — private key that can SSH as `shrenik` into `168.144.16.172` (and, separately, into the production host)

If any of the three `VITE_*` secrets are missing or added to the wrong place (e.g. as a repo-level secret instead of an environment secret, or under "Environment variables" instead of "Environment secrets"), the build silently succeeds but ships with an empty value — e.g. API calls end up hitting `https://activities-test.go2andaman.com/v1/...` instead of `.../api/v1/...`, because `baseURL` resolved to `""`.

## Verifying a deploy

```bash
# Site is up
curl -s -o /dev/null -w "%{http_code}\n" https://activities-test.go2andaman.com

# Correct API base URL made it into the build
ssh -i ~/.ssh/id_rsa shrenik@168.144.16.172 \
  "grep -o 'https://activities-test.go2andaman.com/api' /var/www/staging/g2a-activities-frontend/dist/assets/index-*.js"

# Deployed files look right
ssh -i ~/.ssh/id_rsa shrenik@168.144.16.172 \
  "ls /var/www/staging/g2a-activities-frontend/dist"
```

## Re-running a deploy without new code changes

Push an empty commit to `staging`:

```bash
git checkout staging
git commit --allow-empty -m "Trigger staging deploy"
git push origin staging
```

Or re-run the failed/previous workflow from the **Actions** tab on GitHub.

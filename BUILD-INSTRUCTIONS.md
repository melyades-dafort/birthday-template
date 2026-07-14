# Build Instructions for Cloudflare Pages

## ⚠️ IMPORTANT: Update Build Settings

Go to Cloudflare Pages → Your Project → Settings → Build & deployments

Change the **Build command** to:
```
npm install && npm run build
```

**NOT** `npm ci` or `npm clean-install`

This is because the lock file may have minor inconsistencies.

## Current Settings Should Be:

- **Framework preset**: None
- **Build command**: `npm install && npm run build`
- **Build output directory**: `.output/public`
- **Root directory**: (empty)
- **Node version**: 20 or higher

## If Build Still Fails:

Try deleting `package-lock.json` and using only `package.json`:

```bash
rm package-lock.json
git add -A
git commit -m "Remove lock file"
git push
```

Then in Cloudflare, change build command to:
```
npm install --legacy-peer-deps && npm run build
```

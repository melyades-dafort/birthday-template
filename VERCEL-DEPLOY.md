# Deploy to Vercel - Simple & Fast!

Vercel is easier than Cloudflare - environment variables work perfectly!

## Step 1: Sign Up for Vercel (2 minutes)

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub** (easiest)
4. Authorize Vercel to access your GitHub account

## Step 2: Import Your Repository (1 minute)

1. Click **Add New...** → **Project**
2. Find **birthday-template** in your GitHub repos
3. Click **Import**

## Step 3: Configure Build Settings (1 minute)

Vercel will auto-detect most settings. Just verify:

- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `.output/public`
- **Install Command:** `npm install --legacy-peer-deps`

## Step 4: Add Environment Variables (2 minutes)

**IMPORTANT:** Add these BEFORE clicking Deploy!

Click **Environment Variables** dropdown and add:

### Variable 1:
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://zkdqljffitzvunaaanjs.supabase.co`
- Check: **Production**, **Preview**, **Development**

### Variable 2:
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcWRsbGp0ZnR6dnVuYWFhbmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzY3MTYsImV4cCI6MjA5OTYxMjcxNn0.lNlM1XdG8yfS2f_2PBqtKSzbA1XR9ae1LI9T7jB0gPg`
- Check: **Production**, **Preview**, **Development**

## Step 5: Deploy! (3-4 minutes)

1. Click **Deploy** button
2. Wait for build to complete (3-4 minutes)
3. You'll get a URL like: `https://birthday-template-abc123.vercel.app`

## Step 6: Test Super Short URLs

1. Go to `https://your-url.vercel.app/admin`
2. Click **Generate Shareable Link**
3. Should see:
   ```
   ✅ Super Short Link Copied!
   
   📏 URL reduced by 99%
   🔗 https://your-url.vercel.app/s/aB3xY9
   📊 Only ~60 characters!
   ```

## Automatic Deployments

Every time you push to GitHub, Vercel automatically:
- Builds your project
- Deploys to production
- Gives you a preview URL

No manual redeploying needed! 🎉

## Custom Domain (Optional)

Want your own domain like `birthday.yourname.com`?

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Done! Free SSL included.

---

## Troubleshooting

### Build fails?

Check **Install Command** is set to:
```
npm install --legacy-peer-deps
```

### Still showing long URLs?

1. Check environment variables are added
2. Go to Deployments → Click three dots → Redeploy
3. Wait for rebuild

### Want to update environment variables?

1. Settings → Environment Variables
2. Edit the variable
3. Deployments → Redeploy

---

## Why Vercel?

✅ Simpler than Cloudflare  
✅ Environment variables work immediately  
✅ Automatic deployments from GitHub  
✅ Better build logs and debugging  
✅ Free SSL and CDN  
✅ Generous free tier  

Perfect for selling your birthday templates!

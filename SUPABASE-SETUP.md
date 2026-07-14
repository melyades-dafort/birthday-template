# Supabase Setup for Super Short URLs

## Why Supabase?

Supabase is FREE, easier to set up than Cloudflare KV, and gives you:
- ✅ 500MB storage (enough for 10,000+ birthday links!)
- ✅ Simple setup - just copy 2 values
- ✅ No complex bindings or deployment issues
- ✅ Works immediately - no waiting for deployments

## Step 1: Create Supabase Account (2 minutes)

1. Go to https://supabase.com
2. Click **Start your project**
3. Sign up with GitHub (recommended) or email
4. Free tier is perfect - no credit card needed!

## Step 2: Create a New Project (1 minute)

1. Click **New Project**
2. Fill in:
   - **Name:** `birthday-template` (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
3. Click **Create new project**
4. Wait 1-2 minutes for database to provision

## Step 3: Create the Table (2 minutes)

1. Click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste this SQL code:

```sql
-- Create table for short URLs
CREATE TABLE short_urls (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_short_urls_expires ON short_urls(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for retrieving short URLs)
CREATE POLICY "Allow public read" ON short_urls
  FOR SELECT
  USING (expires_at > NOW());

-- Allow anyone to insert (for creating short URLs)
CREATE POLICY "Allow public insert" ON short_urls
  FOR INSERT
  WITH CHECK (true);

-- Auto-delete expired URLs (runs daily)
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule(
  'delete-expired-urls',
  '0 0 * * *',
  $$DELETE FROM short_urls WHERE expires_at < NOW()$$
);
```

4. Click **Run** button
5. Should see: "Success. No rows returned"

## Step 4: Get Your API Keys (1 minute)

1. Click **Settings** (gear icon) in left sidebar
2. Click **API** under Project Settings
3. Find these two values:

**Project URL:**
```
https://abcdefghijk.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...very...long...key
```

4. **Keep this tab open!** You'll need these values next.

## Step 5: Add Environment Variables to Cloudflare Pages (3 minutes)

1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages**
3. Click **birthday-template** project
4. Click **Settings** tab
5. Scroll to **Environment variables** section
6. Click **Add variables** button

Add these TWO variables:

**Variable 1:**
- **Variable name:** `VITE_SUPABASE_URL`
- **Value:** Paste your Project URL (from Step 4)
- **Environment:** Production
- Click **Add variable**

**Variable 2:**
- **Variable name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** Paste your anon public key (from Step 4)
- **Environment:** Production
- Click **Add variable**

7. Click **Save** button at the bottom

## Step 6: Redeploy Your Site (2 minutes)

Environment variables only apply to NEW deployments!

**Option A: Push a small change**
```bash
cd c:\Users\HP\OneDrive\Desktop\Birthday-template-lovable
echo "# Supabase configured" >> README.md
git add README.md
git commit -m "Add Supabase for super short URLs"
git push
```

**Option B: Manual redeploy**
1. Go to **Deployments** tab
2. Find latest deployment
3. Click three dots → **Retry deployment**

## Step 7: Test! (1 minute)

1. Wait 2-3 minutes for deployment to complete
2. Go to `https://yoursite.pages.dev/admin`
3. Click **Generate Shareable Link**

**Expected result:**
```
✅ Super Short Link Copied!

📏 URL reduced by 99%
🔗 https://yoursite.pages.dev/s/aB3xY9
📊 Only 62 characters!

✨ Works with uploaded photos!
⏰ Valid for 1 year
```

## Troubleshooting

### Still showing 148k characters?

**Check 1:** Environment variables added?
- Go to Settings → Environment variables
- Should see both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Check 2:** Redeployed AFTER adding variables?
- Variables only work on new deployments
- Go to Deployments tab
- Should see a deployment AFTER you added the variables

**Check 3:** Browser console errors?
- Press F12 on `/admin` page
- Click "Generate Link"
- Look for red errors mentioning Supabase

### Error: "relation short_urls does not exist"

- You didn't run the SQL from Step 3
- Go back to Supabase → SQL Editor → Run the SQL again

### Error: "JWT expired" or "Invalid API key"

- You copied the wrong key
- Go to Supabase → Settings → API
- Copy the **anon public** key (not service_role!)
- Update the environment variable in Cloudflare

## Checking Your Database

Want to see your short URLs?

1. Go to Supabase dashboard
2. Click **Table Editor** in left sidebar
3. Click **short_urls** table
4. See all your generated short links!

You can manually delete old links or test links here too.

## Cost

**Free tier includes:**
- 500MB database storage
- 2GB file storage
- 50MB file uploads
- 50,000 monthly active users
- 2 free projects

**Perfect for:**
- Personal use
- Selling 100-500 birthday templates per year
- Testing before launching

**When to upgrade ($25/month):**
- 10,000+ short URLs created
- Need more than 500MB storage
- Want automatic backups

---

## Next Steps

✅ Supabase is now set up!  
✅ Short URLs work with uploaded photos!  
✅ URLs are 99% shorter (~60 chars instead of 148k!)  
✅ Valid for 1 year automatically  

Now you can sell your template with confidence that customers can share their customized birthday greetings easily!

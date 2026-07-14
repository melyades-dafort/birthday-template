# Quick Fix - Add Environment Variables to Cloudflare

Your app is already deployed and working on Cloudflare! We just need to add the Supabase variables.

## Steps (5 minutes):

### 1. Go to Cloudflare Dashboard
https://dash.cloudflare.com

### 2. Navigate to Your Project
- Click **Workers & Pages**
- Click **birthday-template**
- Click **Settings** tab

### 3. Add Environment Variables
Scroll down to **Environment variables** section and click **Add variables**

**Add these 2 variables:**

#### Variable 1:
- Name: `VITE_SUPABASE_URL`
- Value: `https://zkdqljffitzvunaaanjs.supabase.co`
- Environment: **Production** ✅

#### Variable 2:
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcWRsbGp0ZnR6dnVuYWFhbmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzY3MTYsImV4cCI6MjA5OTYxMjcxNn0.lNlM1XdG8yfS2f_2PBqtKSzbA1XR9ae1LI9T7jB0gPg`
- Environment: **Production** ✅

Click **Save**

### 4. Redeploy
- Go to **Deployments** tab
- Find the latest successful deployment
- Click **three dots menu** (...)
- Click **Retry deployment**

### 5. Wait & Test (3 minutes)
Wait for deployment to finish, then:

1. Go to: `https://yoursite.pages.dev/admin`
2. Click **Generate Shareable Link**
3. Should see: **Super Short Link! ~60 characters**

---

## That's it!

The code is already working on Cloudflare. Just needs those 2 environment variables! 🎉

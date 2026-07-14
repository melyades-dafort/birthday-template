# 🚀 SET UP D1 DATABASE NOW! (5 Minutes)

## ✅ You have the code! Now activate the database:

### Step 1: Create Database (2 minutes)

Open your terminal and run:

```bash
npx wrangler d1 create birthday-db
```

**Copy the `database_id` from the output!**

---

### Step 2: Update wrangler.toml

Open `wrangler.toml` and replace this line:

```toml
database_id = "YOUR_DATABASE_ID"
```

With your actual ID from Step 1.

---

### Step 3: Run Migration

```bash
npx wrangler d1 execute birthday-db --remote --file=./migrations/0001_create_birthday_links.sql
```

---

### Step 4: Bind to Cloudflare Pages

1. Go to: https://dash.cloudflare.com
2. Navigate: **Workers & Pages** → **birthday-template** → **Settings** → **Functions**
3. Scroll to: **D1 Database Bindings**
4. Click **Add binding**:
   - Variable name: `DB`
   - D1 database: Select `birthday-db`
5. Click **Save**

---

### Step 5: Deploy

```bash
git add wrangler.toml
git commit -m "Configure D1 database ID"
git push
```

---

## ✨ Done!

Now when users upload photos and click "Generate Link":
- ✅ URL will be super short: `/s/abc123`
- ✅ Only ~45 characters total!
- ✅ 95% shorter than before!
- ✅ Perfect for WhatsApp/SMS!

---

## 📚 Full Guide

For troubleshooting and details, see: **D1-SETUP.md**

---

**🎉 Your birthday template is ready to sell with super short URLs!**

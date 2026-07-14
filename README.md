# 🎂 Birthday Template - Interactive 3D Birthday Greeting

A stunning, customizable 3D birthday greeting experience with admin panel and super short shareable links.

## ✨ Features

- 🎨 **Beautiful 3D Animations** - Rotating cake, floating memories, particle effects
- 📸 **12 Custom Photos** - Each with title and personalized message
- 🎵 **Background Music** - Default song included, upload your own MP3
- 🎁 **Admin Panel** - Easy-to-use interface at `/admin`
- 🔗 **Super Short URLs** - 95% size reduction with Cloudflare KV
- 📱 **Mobile Friendly** - Works perfectly on all devices
- 💾 **Export & Share** - Generate shareable links with one click

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Visit: `http://localhost:3000`

### 3. Customize Your Birthday Greeting

Go to: `http://localhost:3000/admin`

- **General Tab**: Change name, upload custom music
- **Photos Tab**: Upload 12 photos with titles and messages
- **Messages Tab**: Write final birthday greeting

### 4. Generate Shareable Link

Click **"🔗 Generate Shareable Link"** in admin panel to create:
- **85% reduction** (ready now): Compressed data in URL
- **95% reduction** (5-min setup): Super short `/s/abc123` URLs

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

Output: `.output/` folder

### Deploy to Cloudflare Pages

See [CLOUDFLARE-DEPLOY.md](./CLOUDFLARE-DEPLOY.md) for detailed instructions.

**Quick steps:**
1. Go to https://pages.cloudflare.com
2. Sign up (FREE)
3. Upload `.output` folder
4. Get your URL: `https://your-site.pages.dev`

## 🔗 Enable 95% URL Shortening (Optional)

Transform URLs from:
```
❌ https://site.pages.dev/?d=N4IgzgpgTgngBATgFwg... (long)
```

To:
```
✅ https://site.pages.dev/s/abc123 (super short!)
```

**See [URL-SHORTENING-GUIDE.md](./URL-SHORTENING-GUIDE.md) for 5-minute setup.**

Benefits:
- ✅ Perfect for SMS (character limits)
- ✅ Clean, professional links
- ✅ Easy to share on WhatsApp/Messenger
- ✅ FREE with Cloudflare KV

## 💰 Selling This Template

Two business models available:

### Model 1: DIY Template Sale
Sell the template with admin panel - customers customize themselves.

**Pricing:** ₱799-1,999 one-time or ₱299-799/month

See [DIY-SELLING-GUIDE.md](./DIY-SELLING-GUIDE.md)

### Model 2: Custom Service
You customize for each customer.

**Pricing:** ₱300-2,500 per order

See [SELLING-GUIDE.md](./SELLING-GUIDE.md)

## 📚 Documentation

- **[CLOUDFLARE-DEPLOY.md](./CLOUDFLARE-DEPLOY.md)** - Deploy to hosting (5 minutes)
- **[URL-SHORTENING-GUIDE.md](./URL-SHORTENING-GUIDE.md)** - Enable 95% URL shortening
- **[DIY-SELLING-GUIDE.md](./DIY-SELLING-GUIDE.md)** - Sell as DIY template
- **[SELLING-GUIDE.md](./SELLING-GUIDE.md)** - Offer as custom service
- **[BUILD-INSTRUCTIONS.md](./BUILD-INSTRUCTIONS.md)** - Building instructions
- **[KV-SETUP.md](./KV-SETUP.md)** - Cloudflare KV database setup

## 🛠️ Tech Stack

- **Framework**: TanStack Start (React SSR)
- **3D**: React Three Fiber (@react-three/fiber)
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Compression**: LZ-String
- **Hosting**: Cloudflare Pages
- **Database**: Cloudflare Workers KV (optional, for URL shortening)

## 📁 Project Structure

```
birthday-template/
├── src/
│   ├── routes/
│   │   ├── index.tsx           # Main birthday experience
│   │   ├── admin.tsx            # Admin customization panel
│   │   ├── api/
│   │   │   └── shorten.ts       # URL shortening API
│   │   └── s/
│   │       └── $id.tsx          # Short URL redirect handler
│   ├── components/
│   │   ├── experience/          # 3D scenes and animations
│   │   └── ui/                  # Reusable UI components
│   ├── hooks/
│   │   └── useBirthdayData.ts   # State management hook
│   └── data/
│       └── memories.ts          # Default content
├── public/
│   ├── memories/                # Photo gallery
│   ├── audio/                   # Background music
│   └── models/                  # 3D models
├── wrangler.toml                # Cloudflare configuration
└── package.json
```

## 🎯 How It Works

### User Flow:
1. Recipient opens link: `https://site.pages.dev/s/abc123`
2. System loads custom birthday data from KV database
3. Beautiful 3D experience plays with personalized content
4. 12 memory photos appear in scrapbook
5. Celebrant makes a wish on the cake
6. Final birthday message displays

### Admin Flow:
1. Creator goes to `/admin`
2. Customizes name, photos, messages, music
3. Clicks "Save Changes"
4. Clicks "Generate Shareable Link"
5. Short URL copied to clipboard
6. Sends link to recipient

## 🔐 Data Storage

- **localStorage**: Saves customizations locally
- **URL parameters**: Shares data via compressed URLs
- **Cloudflare KV** (optional): Stores data for super short URLs

All methods work offline-first - no backend required!

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  berry: '#C41E3A',  // Main color
  // Add your colors
}
```

### Change Default Content
Edit `src/data/memories.ts`

### Change 3D Model
Replace `public/models/strawberry_cake.glb`

### Change Music
Replace `public/audio/birthday-ambient.mp3`

## 🐛 Troubleshooting

### Admin panel not loading?
- Check URL: Should end with `/admin`
- Clear browser cache
- Try incognito mode

### Photos not uploading?
- Max size: 2MB per photo
- Supported: JPG, PNG, WebP
- Stored in browser's localStorage

### Music not playing?
- Browser autoplay policies may block
- User needs to interact with page first
- MP3 format recommended

### Build fails?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

### Short URLs not working?
- See [URL-SHORTENING-GUIDE.md](./URL-SHORTENING-GUIDE.md)
- Verify Cloudflare KV is set up
- Check wrangler.toml configuration
- System falls back to compressed URLs automatically

## 📊 Performance

- **Load Time**: < 3 seconds on 3G
- **File Size**: ~2MB (with default assets)
- **Mobile**: Fully optimized
- **SEO**: Server-side rendered

## 🔒 Security

- HTTPS enforced
- No sensitive data collected
- Client-side storage only
- Random short IDs (56 billion combinations)
- 1-year link expiration

## 📝 License

This is a commercial template. See selling guides for distribution rights.

## 🆘 Support

For help:
1. Check documentation files
2. Review troubleshooting section
3. Contact: [Your contact info]

## 🎉 Credits

Built with ❤️ using modern web technologies.

---

**Ready to create magical birthday experiences!** ✨

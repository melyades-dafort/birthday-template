# 🎂 Interactive 3D Birthday Experience Template

A stunning, immersive birthday template with 3D animations, floating photo memories, interactive cake, and customizable messages. Perfect for creating memorable birthday surprises!

## ✨ Features

- **🎨 Beautiful 3D Scene** - Interactive rotating cake with sprinkles
- **📸 Floating Photo Cards** - Display 12 custom memory photos in 3D space
- **📖 Digital Scrapbook** - Flip through memories with elegant page-turn animations
- **🎵 Background Music** - Upload custom MP3 or use the default song
- **🎁 Gift Intro Screen** - Welcoming animation to start the experience
- **🎊 Celebration Scene** - Confetti and animated birthday wishes
- **💝 Fully Customizable** - Easy-to-use admin panel for personalization
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎭 Smooth Animations** - Professional transitions and effects
- **🔊 Audio Controls** - Music toggle with volume control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or bun package manager

### Installation

1. **Extract the template files** to your project folder

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser** and navigate to `http://localhost:8080`

## 🎨 Customization Guide

### Using the Admin Panel

1. Navigate to `/admin` in your browser
2. Customize the following sections:

#### **General Tab**
- **Birthday Person's Name** - This appears throughout the experience
- **Background Music** - Upload your own MP3 or use the default

#### **Photos & Captions Tab**
- **Upload Photos** - 12 memory photos (any image format)
- **Photo Title** - Short title that appears below each photo
- **Photo Message** - Longer message that appears in the scrapbook

#### **Messages Tab**
- **Final Greeting Message** - Heartfelt message shown at the celebration

3. Click **"Save Changes"** when done
4. Return to the main page to see your changes

### Manual Customization (Advanced)

#### Change Default Values
Edit `src/data/memories.ts`:
```typescript
export const birthdayConfig = {
  celebrantName: "Your Name",
  senderName: "With love",
  openingMessage: "Your message...",
  finalMessage: "Your wishes..."
};
```

#### Add/Change Photos
Place images in `public/memories/` and update the paths in `src/data/memories.ts`

#### Change Background Music
Place your MP3 file in `public/audio/birthday-ambient.mp3`

## 🏗️ Building for Production

### Build the Project
```bash
npm run build
```

This creates a `dist` folder with optimized files.

### Deployment Options

#### **Option 1: Netlify (Recommended)**
1. Sign up at [netlify.com](https://netlify.com)
2. Drag & drop the `dist` folder
3. Get your live URL instantly

#### **Option 2: Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts

#### **Option 3: Traditional Hosting**
Upload the contents of the `dist` folder to your web host via FTP

## 📁 Project Structure

```
birthday-template/
├── public/
│   ├── audio/              # Background music files
│   ├── memories/           # Memory photos (12 images)
│   ├── models/            # 3D model files (cake)
│   └── *.jpg/png/webp     # Background images
├── src/
│   ├── components/
│   │   └── experience/    # All experience components
│   ├── data/
│   │   └── memories.ts    # Configuration & content
│   ├── hooks/             # Custom React hooks
│   └── routes/            # Page routes (main, admin)
├── README.md
└── package.json
```

## 🎯 Use Cases

- Birthday surprises for loved ones
- Event planning services
- Digital greeting cards
- Social media birthday posts
- Corporate birthday recognition
- Virtual birthday parties

## 🛠️ Technical Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Three.js / React Three Fiber** - 3D graphics
- **Framer Motion** - Smooth animations
- **TanStack Router** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## ⚡ Performance Tips

- Use optimized images (WebP format recommended)
- Keep photos under 2MB each
- Use compressed audio files (128-192 kbps MP3)
- Test on target devices before deployment

## 🐛 Troubleshooting

### Photos not appearing?
- Check file paths in admin panel or `src/data/memories.ts`
- Ensure images are in `public/memories/` folder
- Verify image file formats (jpg, png, webp)

### Music not playing?
- Check browser autoplay policies (some browsers block autoplay)
- Ensure audio file is valid MP3 format
- Check browser console for errors

### 3D elements not rendering?
- Ensure WebGL is enabled in browser
- Update graphics drivers
- Try a different browser

### Changes not reflecting?
- Clear localStorage in browser DevTools
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

## 📄 License

This template is licensed for commercial use. See LICENSE file for details.

## 💬 Support

For issues or questions:
- Check the troubleshooting section above
- Review the customization guide
- Contact: [Your support email/website]

## 🎉 Credits

- 3D Cake Model: Custom design
- Background Music: Default song "Kabisado - IV OF SPADES"
- Built with modern web technologies

---

**Enjoy creating beautiful birthday experiences! 🎂✨**

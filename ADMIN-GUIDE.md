# Birthday Template - Admin Guide

## How to Customize Your Birthday Experience

### Accessing the Admin Panel

Navigate to `/admin` in your browser to access the customization panel.

Example: `http://localhost:8080/admin`

---

## Customization Options

### 1. General Settings
- **Birthday Person's Name**: Change the name that appears throughout the experience
  - Shows on the "Happy Birthday" hero section
  - Appears in the wish scene ("for [Name]")

### 2. Photos & Captions
- **Upload Custom Photos**: Replace the default 12 memory photos with your own
  - Click "Choose File" to upload a new image for each memory slot
  - Images are stored in your browser's localStorage
  - Supported formats: JPG, PNG, GIF, WebP
  
- **Add Captions**: Write personalized messages for each photo
  - Captions appear in the scrapbook when viewing each memory
  - Can be as short or long as you like

### 3. Messages
- **Final Greeting Message**: Customize the heartfelt message that appears after the wish scene
  - This is the last message in the celebration phase
  - Default message is provided but can be fully customized
  - Supports multiple paragraphs

---

## How It Works

All customizations are saved to your browser's **localStorage**:
- Data persists even after closing the browser
- Changes are instantly available on the main birthday experience
- To see updates, refresh the main page (`/`)

### Storage Keys
- `birthdayData`: Contains name, photo URLs, captions, and messages
- `birthdayPreviews`: Contains base64-encoded uploaded images

---

## Tips

1. **Upload high-quality images** for best results (recommended: 800x1000px or similar portrait aspect ratio)
2. **Keep captions concise** - they'll be easier to read in the scrapbook
3. **Test your changes** by clicking "Save Changes" and refreshing the main page
4. **Backup your data** by exporting localStorage if you want to preserve customizations

---

## Resetting to Defaults

To reset all customizations:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `localStorage.removeItem('birthdayData')`
4. Run: `localStorage.removeItem('birthdayPreviews')`
5. Refresh the page

---

## Navigation

- **Admin Panel**: `/admin`
- **Birthday Experience**: `/` (home page)

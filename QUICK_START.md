# ⚡ Quick Start Guide

## 🎯 Get Running in 5 Minutes

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Set Up Environment (1 min)
```bash
# Copy the environment template
cp env.example .env

# Edit .env with your Firebase credentials (optional for now)
# The app will work without Firebase, but visitor counter won't function
```

### Step 3: Run Development Server (30 sec)
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### Step 4: Build for Production
```bash
npm run build
npm run preview  # Preview the production build
```

---

## 📝 What You Need to Know

### Project Structure (Simplified)
```
src/
├── components/      # UI components (ActivityBar, Editor, Terminal, etc.)
├── store/          # Redux state (theme, tabs, terminal, matrix)
├── hooks/          # Custom hooks (useTheme, useTerminal)
├── data/           # Your content (EDIT THIS!)
└── styles/         # CSS themes
```

### Key Files to Edit

#### 1. **Your Content**: `src/data/pageContent.tsx`
```typescript
// Update your information here
export const pageContent = {
  home: { content: `<h1>Your Name</h1>...` },
  skills: { data: [/* Your skills */] },
  experience: { data: [/* Your experience */] }
}
```

#### 2. **GitHub Stats**: `src/components/Editor/pages/GitHubPage.tsx`
```typescript
// Line 16-18: Replace with your GitHub username
username=abhishek305  // ← Change this
username=OkayDexter   // ← And this (for profile views)
```

#### 3. **Firebase Config**: `.env`
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
```

---

## 🎨 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code with ESLint |

---

## 🎮 Terminal Commands (Try Them!)

Open the terminal in the app and type:
- `help` - See all commands
- `skills` - Go to skills page
- `contact` - Show contact info
- `matrix` - 👀 Easter egg!

---

## 🎨 Available Themes

1. Dark+ (Default)
2. Light+
3. Monokai
4. Solarized Dark
5. Midnight
6. Cyberpunk
7. High Contrast

Click the palette icon in the bottom-left to switch themes.

---

## 🚀 Deploy Now

### Vercel (Recommended - 2 minutes)
```bash
npm install -g vercel
vercel
```
Follow the prompts → Done!

### Netlify
1. Run `npm run build`
2. Drag `dist/` folder to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Done!

---

## 🔧 Common Issues & Fixes

### Port 5173 already in use
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or change the port
npm run dev -- --port 3000
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Check for errors
npm run build

# Some errors are warnings and won't block the build
```

### Firebase not working
The app works without Firebase! The visitor counter just won't show.
To fix: Add Firebase credentials to `.env`

---

## 📦 What's Included

✅ 7 Color themes with instant switching  
✅ Interactive terminal with commands  
✅ Real-time visitor counter (Firebase)  
✅ GitHub stats with theme sync  
✅ Matrix easter egg animation  
✅ PWA support (offline mode)  
✅ SEO optimized  
✅ Fully responsive  
✅ TypeScript for type safety  
✅ Redux for state management  

---

## 🎯 Next Steps

1. ✅ **Running?** You're done with setup!
2. 📝 **Customize**: Edit `src/data/pageContent.tsx`
3. 🎨 **Personalize**: Add your own profile picture
4. 🔥 **Firebase**: Set up for visitor counter
5. 🚀 **Deploy**: Push to Vercel/Netlify

---

## 📚 Full Documentation

- `README.md` - Complete overview
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `PROJECT_STRUCTURE.md` - Architecture deep dive
- `MIGRATION_GUIDE.md` - What changed from HTML

---

## 💬 Need Help?

1. Check the documentation files above
2. Look at console for errors
3. Verify Node.js version: `node -v` (should be 18+)
4. Clear cache: `rm -rf node_modules package-lock.json && npm install`

---

## 🎉 You're All Set!

Your portfolio is now a modern React app with:
- ⚡ Lightning-fast development with Vite
- 🛡️ Type-safe with TypeScript
- 🎨 7 beautiful themes
- 📱 PWA-enabled
- 🔍 SEO-optimized
- 🚀 Production-ready

**Happy coding!** 🚀

---

### Quick Commands Reference

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build

# Deployment
vercel               # Deploy to Vercel
netlify deploy       # Deploy to Netlify

# Troubleshooting
rm -rf node_modules  # Clear modules
npm install          # Reinstall
npm run lint         # Check for issues
```

**Start here, then explore the other docs!** 📚


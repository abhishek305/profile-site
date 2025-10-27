# Portfolio IDE - Abhishek Ezhava

An interactive, VS Code-themed portfolio built with React, TypeScript, Vite, and Redux Toolkit.

## 🚀 Features

- **IDE-Themed UI**: Mimics Visual Studio Code with activity bar, tabs, editor, terminal, and status bar
- **7 Color Themes**: Dark+, Light+, Monokai, Solarized Dark, Midnight, Cyberpunk, and High Contrast
- **Interactive Terminal**: Execute commands to navigate, view contact info, and more
- **Clean Architecture**: No external dependencies for backend services
- **GitHub Stats Integration**: Dynamic GitHub statistics with theme-aware styling
- **Matrix Easter Egg**: Hidden matrix animation accessible via terminal
- **PWA Enabled**: Works offline and can be installed as an app
- **SEO Optimized**: Meta tags, Open Graph, and structured data for search engines
- **Fully Responsive**: Works seamlessly across desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Custom CSS Variables
- **PWA**: vite-plugin-pwa
- **SEO**: react-helmet-async
- **Backend**: None (static site, can be easily extended)
- **Fonts**: Inter & JetBrains Mono (Google Fonts)

## 📁 Project Structure

```
portfolio-ide/
├── src/
│   ├── components/           # React components
│   │   ├── ActivityBar/      # Left sidebar navigation
│   │   ├── Editor/           # Main content area
│   │   │   └── pages/        # Individual page components
│   │   ├── icons/            # SVG icon components
│   │   ├── Matrix/           # Matrix animation
│   │   ├── SEO/              # SEO component
│   │   ├── StatusBar/        # Bottom status bar
│   │   ├── TabsBar/          # Tab navigation
│   │   └── Terminal/         # Interactive terminal
│   ├── contexts/             # React contexts (Firebase)
│   ├── data/                 # Static content data
│   ├── hooks/                # Custom React hooks
│   ├── store/                # Redux store
│   │   └── slices/           # Redux slices
│   ├── styles/               # Global CSS
│   ├── types/                # TypeScript types
│   ├── constants/            # App constants
│   ├── App.tsx               # Root component
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🏗️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-ide
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```
   
   Preview production build:
   ```bash
   npm run preview
   ```

## 🎨 Customization

### Update Personal Information

- **Content**: Edit `src/data/pageContent.tsx`
- **Skills**: Modify the `skillsData` array
- **Experience**: Update the `experienceData` array
- **GitHub Stats**: Replace usernames in `GitHubPage.tsx`

### Add/Modify Themes

- Edit `src/styles/index.css` CSS variables for each theme
- Update `src/constants/themes.ts` to add new theme options

### Extending with Backend Services

This portfolio is a static site by default, but you can easily add backend services like:
- Firebase for visitor tracking
- Analytics services (Google Analytics, Plausible, etc.)
- Contact form APIs (FormSpree, Netlify Forms, etc.)
- Custom API integrations

## 💻 Terminal Commands

Type these commands in the interactive terminal:

- `help` - Display available commands
- `about` - Navigate to About page
- `skills` - Navigate to Skills page
- `experience` - Navigate to Experience page
- `github` - Navigate to GitHub Stats page
- `home` - Navigate to Home page
- `contact` - Display contact information
- `clear` - Clear terminal screen
- `matrix` - Launch matrix animation (Easter egg!)

## 📦 PWA Features

This portfolio is a Progressive Web App with:

- **Offline Support**: Service worker caches assets for offline access
- **Install Prompt**: Can be installed on desktop and mobile devices
- **App Icons**: Custom icons for home screen
- **Manifest**: Full PWA manifest configuration

## 🔍 SEO Features

- Meta tags for search engines
- Open Graph tags for social media sharing
- Structured data for rich snippets
- Canonical URLs
- Sitemap ready
- Mobile-friendly and responsive

## 🚢 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

### Deploy to GitHub Pages

Add to `vite.config.ts`:
```typescript
base: '/your-repo-name/'
```

```bash
npm run build
# Push 'dist' folder to gh-pages branch
```

## 📝 License

MIT License - feel free to use this as a template for your own portfolio!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

**Abhishek Ezhava**
- Email: abhishekshaji1994@gmail.com
- LinkedIn: [linkedin.com/in/abhishek-ezhava](https://linkedin.com/in/abhishek-ezhava)
- GitHub: [@abhishek-ezhava](https://github.com/abhishek-ezhava)

---

⭐ Star this repo if you found it helpful!


# Portfolio IDE - Abhishek Ezhava

An interactive, VS Code-themed portfolio built with React, TypeScript, Vite, and Redux Toolkit.

## 🚀 Features

- **IDE-Themed UI**: Mimics Visual Studio Code with activity bar, tabs, editor, terminal, and status bar
- **Command Palette**: `Ctrl/Cmd + P` for fuzzy "go to file" and commands, VS Code style
- **Deep-Linkable Tabs**: Every page has its own URL (`/#projects`) and the back button works
- **7 Color Themes**: Dark+, Light+, Monokai, Solarized Dark, Midnight, Cyberpunk, and High Contrast
- **Interactive Terminal**: Command history (`↑`/`↓`), tab completion, and theme switching
- **Data-Driven Pages**: Add a page or a job in one file — see [Adding content](#-adding-content)
- **Live GitHub Stats**: Repos, stars, followers, language mix, and top repositories
  read straight from the public GitHub API and rendered natively — no third-party
  image services (the previous ones are all dead) and no broken-image states
- **Matrix Easter Egg**: Hidden matrix animation accessible via terminal
- **PWA Enabled**: Works offline and can be installed as an app
- **SEO Optimized**: Meta tags, Open Graph, and structured data for search engines
- **Accessible**: Visible focus rings, ARIA labels, `prefers-reduced-motion` support
- **Fully Responsive**: Master-detail views stack into scrollable strips on mobile

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + P` (or `+ K`) | Open the command palette |
| `Ctrl + \`` | Toggle the terminal |
| `↑` / `↓` (in terminal) | Walk command history |
| `Tab` (in terminal) | Complete a command |
| `Esc` | Close the palette / exit the matrix |

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
│   │   ├── CommandPalette/   # Ctrl+P fuzzy finder
│   │   ├── Editor/           # Main content area
│   │   │   └── pages/        # Individual page components
│   │   ├── icons/            # SVG icon components
│   │   ├── Matrix/           # Matrix animation
│   │   ├── SEO/              # SEO component
│   │   ├── StatusBar/        # Bottom status bar
│   │   ├── TabsBar/          # Tab navigation
│   │   └── Terminal/         # Interactive terminal
│   ├── data/
│   │   ├── content.ts        # ALL portfolio copy — edit this
│   │   └── pages.tsx         # Page registry (tabs, nav, routes)
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

5. **Smoke test** (needs `npm run dev` running in another terminal)
   ```bash
   npm run smoke
   ```

   Drives the real app in headless Chrome over the DevTools Protocol — no test
   framework, no extra dependencies. Checks deep links, the command palette,
   terminal history/completion, and that mobile doesn't overflow.

## ✍️ Adding content

All copy lives in **`src/data/content.ts`**. Adding a job, a skill category, or a
project means appending to one array there — nothing else changes:

```ts
// src/data/content.ts
export const experienceData: ExperienceData[] = [
  {
    role: "Staff Engineer",
    company: "Somewhere",
    date: "2026 - Present",
    tech: ["Rust", "Kafka"],        // optional — renders as chips
    highlights: ["Did the thing."],
  },
  ...
];
```

### Adding a whole new page

Two edits, and TypeScript won't let you forget the second one:

1. **`src/data/pages.tsx`** — add an entry. This alone wires up the tab, the
   activity-bar icon, the command-palette entry, the terminal command, and the
   `#hash` route:

   ```tsx
   writing: { title: "blog.md", nav: { icon: BookIcon, label: "Writing" } },
   ```

2. **`src/components/Editor/Editor.tsx`** — add the matching view. The `views`
   map is typed `Record<PageId, ...>`, so the build fails until you do:

   ```tsx
   writing: () => <MarkdownPage content={writingMarkdown} />,
   ```

`pages.tsx` deliberately imports nothing but icons — everything else imports it,
so pulling page components in there would create a module cycle.

## 🎨 Customization

- **Identity** (name, GitHub/LinkedIn handles, email): `src/constants/profile.ts` —
  the single source of truth. The GitHub Stats page reads live data from the
  public GitHub API for whatever `githubUser` is set there.

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
- `home` / `about` / `skills` / `experience` / `projects` / `github` - Open that page
- `contact` - Display contact information
- `theme <name>` - Switch theme (bare `theme` lists them)
- `palette` - Open the command palette
- `clear` - Clear terminal screen
- `matrix` - Launch matrix animation (Easter egg!)

Navigation commands are generated from the page registry, so a new page gets its
terminal command for free.

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
- GitHub: [@abhishek305](https://github.com/abhishek305)

---

⭐ Star this repo if you found it helpful!


# Portfolio IDE - Complete Project Structure

## 📂 Directory Tree

```
portfolio-ide/
│
├── 📁 public/                          # Static assets
│   ├── robots.txt                      # SEO robots file
│   └── manifest.webmanifest            # PWA manifest
│   # Add these later:
│   # ├── pwa-192x192.png              # PWA icon 192x192
│   # ├── pwa-512x512.png              # PWA icon 512x512
│   # ├── favicon.ico                  # Favicon
│   # └── apple-touch-icon.png         # iOS icon
│
├── 📁 src/                             # Source code
│   │
│   ├── 📁 components/                  # React components
│   │   │
│   │   ├── 📁 ActivityBar/             # Left sidebar navigation
│   │   │   ├── ActivityBar.tsx         # Main activity bar component
│   │   │   └── ThemePicker.tsx         # Theme selection dropdown
│   │   │
│   │   ├── 📁 Editor/                  # Main content area
│   │   │   ├── Editor.tsx              # Editor container & router
│   │   │   └── 📁 pages/               # Individual page components
│   │   │       ├── WelcomePage.tsx     # Landing/welcome page
│   │   │       ├── MarkdownPage.tsx    # Generic markdown renderer
│   │   │       ├── SkillsPage.tsx      # Skills with master-detail
│   │   │       ├── ExperiencePage.tsx  # Experience with master-detail
│   │   │       └── GitHubPage.tsx      # GitHub stats with theme sync
│   │   │
│   │   ├── 📁 icons/                   # SVG icon components
│   │   │   └── index.tsx               # All icons exported
│   │   │
│   │   ├── 📁 Matrix/                  # Matrix easter egg
│   │   │   └── Matrix.tsx              # Canvas-based matrix animation
│   │   │
│   │   ├── 📁 SEO/                     # SEO optimization
│   │   │   └── SEO.tsx                 # react-helmet-async wrapper
│   │   │
│   │   ├── 📁 StatusBar/               # Bottom status bar
│   │   │   └── StatusBar.tsx           # Status bar with visitor count
│   │   │
│   │   ├── 📁 TabsBar/                 # Tab navigation
│   │   │   └── TabsBar.tsx             # File tabs with close buttons
│   │   │
│   │   └── 📁 Terminal/                # Interactive terminal
│   │       └── Terminal.tsx            # Command-line interface
│   │
│   ├── 📁 contexts/                    # React contexts
│   │   └── FirebaseContext.tsx         # Firebase provider & hooks
│   │
│   ├── 📁 data/                        # Static content
│   │   └── pageContent.tsx             # All page content & data
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── useTheme.ts                 # Theme management hook
│   │   ├── useTerminal.ts              # Terminal commands hook
│   │   └── useTooltip.ts               # Tooltip positioning hook
│   │
│   ├── 📁 store/                       # Redux Toolkit store
│   │   ├── index.ts                    # Store configuration
│   │   ├── hooks.ts                    # Typed Redux hooks
│   │   └── 📁 slices/                  # Redux slices
│   │       ├── themeSlice.ts           # Theme state & actions
│   │       ├── tabsSlice.ts            # Tabs state & actions
│   │       ├── terminalSlice.ts        # Terminal state & actions
│   │       └── matrixSlice.ts          # Matrix state & actions
│   │
│   ├── 📁 styles/                      # Global styles
│   │   └── index.css                   # Tailwind + custom CSS
│   │
│   ├── 📁 types/                       # TypeScript types
│   │   └── index.ts                    # All type definitions
│   │
│   ├── 📁 constants/                   # App constants
│   │   └── themes.ts                   # Theme configs & mappings
│   │
│   ├── App.tsx                         # Root application component
│   ├── main.tsx                        # Application entry point
│   └── vite-env.d.ts                   # Vite environment types
│
├── 📄 index.html                       # HTML entry point (new)
├── 📄 index.html.backup                # Original HTML file (backup)
│
├── 📄 package.json                     # Dependencies & scripts
├── 📄 vite.config.ts                   # Vite configuration
├── 📄 tsconfig.json                    # TypeScript configuration
├── 📄 tsconfig.node.json               # TypeScript config for Node
├── 📄 tailwind.config.js               # Tailwind CSS config
├── 📄 postcss.config.js                # PostCSS config
├── 📄 .eslintrc.cjs                    # ESLint configuration
├── 📄 .gitignore                       # Git ignore rules
│
├── 📄 env.example                      # Environment variables template
├── 📄 README.md                        # Project documentation
├── 📄 SETUP_INSTRUCTIONS.md            # Detailed setup guide
└── 📄 PROJECT_STRUCTURE.md             # This file
```

## 📊 Component Hierarchy

```
App.tsx
├── Provider (Redux)
├── HelmetProvider (SEO)
├── FirebaseProvider (Backend)
├── SEO (Meta tags)
├── Matrix (Easter egg overlay)
└── Layout
    ├── ActivityBar
    │   └── ThemePicker
    └── Main
        ├── TabsBar
        ├── Editor
        │   ├── WelcomePage
        │   ├── MarkdownPage
        │   ├── SkillsPage
        │   ├── ExperiencePage
        │   └── GitHubPage
        ├── Terminal
        └── StatusBar
```

## 🔄 Data Flow

### State Management (Redux)
```
User Action
    ↓
Component Dispatch
    ↓
Redux Action
    ↓
Redux Reducer (Slice)
    ↓
Updated State
    ↓
Component Re-render
```

### Example: Opening a Tab
```typescript
User clicks "Skills" icon
    ↓
ActivityBar dispatches openTab('skills')
    ↓
tabsSlice reducer updates state
    ↓
TabsBar & Editor re-render with new tab
```

## 🎣 Custom Hooks Usage

### useTheme()
```typescript
const { currentTheme, changeTheme, isPickerOpen } = useTheme();
// Used in: ActivityBar, ThemePicker, GitHubPage
```

### useTerminal()
```typescript
const { isOpen, lines, handleCommand } = useTerminal();
// Used in: Terminal, WelcomePage, StatusBar
```

### useFirebase()
```typescript
const { visitorCount } = useFirebase();
// Used in: StatusBar
```

### useAppSelector() / useAppDispatch()
```typescript
const activePage = useAppSelector(state => state.tabs.activePage);
const dispatch = useAppDispatch();
// Used in: All connected components
```

## 📦 Bundle Structure (Post-Build)

```
dist/
├── index.html              # Entry HTML (with injected scripts)
├── assets/
│   ├── index-[hash].js    # Main bundle (minified)
│   ├── index-[hash].css   # Styles bundle
│   └── vendor-[hash].js   # Third-party libs (code-split)
├── pwa-192x192.png        # PWA icons
├── pwa-512x512.png
├── manifest.webmanifest   # PWA manifest
├── robots.txt
└── sw.js                  # Service worker (generated by PWA plugin)
```

## 🔌 Key Integrations

### 1. Redux Toolkit
- **Files**: `src/store/**`
- **Purpose**: Global state management
- **Slices**: theme, tabs, terminal, matrix

### 2. Firebase
- **Files**: `src/contexts/FirebaseContext.tsx`
- **Purpose**: Visitor count & authentication
- **Features**: Real-time updates, anonymous auth

### 3. PWA (vite-plugin-pwa)
- **Config**: `vite.config.ts`
- **Purpose**: Offline support, installability
- **Features**: Service worker, caching, manifest

### 4. SEO (react-helmet-async)
- **Files**: `src/components/SEO/SEO.tsx`
- **Purpose**: Dynamic meta tags
- **Features**: Open Graph, Twitter Cards, structured data

### 5. Tailwind CSS
- **Config**: `tailwind.config.js`
- **Purpose**: Utility-first styling
- **Custom**: Extended with CSS variables for themes

## 🎨 Styling Strategy

### CSS Architecture
```
Tailwind Utilities (layout, spacing)
    +
CSS Variables (theming)
    +
Custom Classes (complex components)
```

### Theme System
```css
:root { /* Dark+ theme */ }
body[data-theme="light-plus"] { /* overrides */ }
body[data-theme="monokai"] { /* overrides */ }
/* ...6 more themes */
```

### Responsive Breakpoints
- Mobile-first approach
- `sm:` - 640px and up
- `md:` - 768px and up

## 🚀 Build Process

```
npm run dev  →  Vite Dev Server (HMR, Fast Refresh)
                      ↓
npm run build  →  TypeScript Check
                      ↓
                  Vite Build (Rollup)
                      ↓
                  Minification & Tree-shaking
                      ↓
                  PWA Asset Generation
                      ↓
                  dist/ folder ready
```

## 📈 Performance Optimizations

1. **Code Splitting**: Vendor libraries separated
2. **Tree Shaking**: Unused code removed
3. **Lazy Loading**: Pages loaded on demand (via routing)
4. **Image Optimization**: GitHub stats cached by service worker
5. **CSS Purging**: Tailwind removes unused utilities
6. **Minification**: JS and CSS minified in production

## 🔒 Environment Variables

```env
VITE_FIREBASE_API_KEY         # Firebase API key
VITE_FIREBASE_AUTH_DOMAIN     # Firebase auth domain
VITE_FIREBASE_PROJECT_ID      # Firebase project ID
VITE_APP_ID                   # Your app identifier
VITE_INITIAL_AUTH_TOKEN       # Optional custom token
```

**Access in code:**
```typescript
import.meta.env.VITE_FIREBASE_API_KEY
```

## 🧪 Testing Strategy (Suggested)

```
Unit Tests → Vitest (for hooks, utilities)
Component Tests → React Testing Library
E2E Tests → Playwright or Cypress
Type Checking → TypeScript (tsc --noEmit)
Linting → ESLint
```

## 📝 Code Conventions

- **File naming**: PascalCase for components (`ActivityBar.tsx`)
- **Folder naming**: PascalCase for component folders
- **Hook naming**: camelCase with `use` prefix (`useTheme`)
- **Type naming**: PascalCase with descriptive names
- **Constants**: UPPER_SNAKE_CASE or camelCase for objects

## 🌟 Feature Flags

Currently none, but you can add:
```typescript
// src/config/features.ts
export const features = {
  enableFirebase: import.meta.env.VITE_ENABLE_FIREBASE === 'true',
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};
```

## 📱 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## 🔄 Update Strategy

1. Update dependencies: `npm outdated` → `npm update`
2. Check for breaking changes in major version updates
3. Test thoroughly after updates
4. Keep TypeScript definitions updated

---

**This structure follows React best practices and is fully production-ready! 🚀**


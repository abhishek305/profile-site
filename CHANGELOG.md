# Changelog

## [1.1.0] - 2025-01-27

### Removed
- **Firebase dependencies**: Removed Firebase from the project to keep it lightweight
  - Removed `firebase` package from dependencies
  - Removed `FirebaseContext.tsx`
  - Removed Firebase configuration from environment variables
  - Removed visitor counter from StatusBar (can be re-added with any analytics service)

### Fixed
- **Theme picker bug**: Fixed issue where theme options couldn't be clicked
  - Added `id="theme-toggle"` to the theme toggle button
  - Added proper event propagation handling
  - Added `stopPropagation` to prevent click events from bubbling

### Changed
- Simplified StatusBar component (removed Firebase dependency)
- Cleaned up environment variables template
- Updated README to reflect Firebase removal
- Project is now a pure static site with no backend dependencies

## [1.0.0] - 2025-01-27

### Added
- Initial conversion from HTML to React + Vite + TypeScript
- Redux Toolkit for state management
- Custom hooks (useTheme, useTerminal, useTooltip)
- PWA support with vite-plugin-pwa
- SEO optimization with react-helmet-async
- 7 color themes with persistence
- Interactive terminal with commands
- Matrix easter egg
- GitHub stats integration
- Component-based architecture
- TypeScript type safety
- Best practices folder structure


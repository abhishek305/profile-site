import type { Theme, GitHubThemeMap } from '@/types';

export const themes: Theme[] = [
  { id: 'dark-plus', name: 'Dark+ (Default)' },
  { id: 'light-plus', name: 'Light+ (Default)' },
  { id: 'monokai', name: 'Monokai' },
  { id: 'solarized-dark', name: 'Solarized Dark' },
  { id: 'night', name: 'Midnight' },
  { id: 'gaming', name: 'Cyberpunk' },
  { id: 'invert', name: 'High Contrast' }
];

export const githubThemeMap: GitHubThemeMap = {
  stats: {
    'dark-plus': 'tokyonight',
    'light-plus': 'default',
    'monokai': 'monokai',
    'solarized-dark': 'solarized_dark',
    'night': 'nightowl',
    'gaming': 'radical',
    'invert': 'default'
  },
  activity: {
    'dark-plus': 'tokyo-night',
    'light-plus': 'default',
    'monokai': 'monokai',
    'solarized-dark': 'solarized_dark',
    'night': 'nightowl',
    'gaming': 'radical',
    'invert': 'default'
  },
  views: {
    'dark-plus': 'c678dd',
    'light-plus': '7c3aed',
    'monokai': 'AE81FF',
    'solarized-dark': '6c71c4',
    'night': 'A78BFA',
    'gaming': 'DA00FF',
    'invert': '800080'
  }
};


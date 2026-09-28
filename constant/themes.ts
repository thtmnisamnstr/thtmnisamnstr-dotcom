export const themes = [
  { id: 'vscode-dark-modern', label: 'Dark Modern', scheme: 'dark', source: 'dark_modern.json' },
  {
    id: 'vscode-light-modern',
    label: 'Light Modern',
    scheme: 'light',
    source: 'light_modern.json',
  },
  { id: 'vscode-dark-2026', label: 'Dark 2026', scheme: 'dark', source: '2026-dark.json' },
  { id: 'vscode-light-2026', label: 'Light 2026', scheme: 'light', source: '2026-light.json' },
  { id: 'vscode-dark-plus', label: 'Dark+', scheme: 'dark', source: 'dark_plus.json' },
  { id: 'vscode-light-plus', label: 'Light+', scheme: 'light', source: 'light_plus.json' },
  { id: 'github-dark', label: 'GitHub Dark', scheme: 'dark' },
  { id: 'github-light', label: 'GitHub Light', scheme: 'light' },
  { id: 'one-dark-pro', label: 'One Dark Pro', scheme: 'dark' },
  { id: 'dracula', label: 'Dracula', scheme: 'dark' },
  { id: 'monokai', label: 'Monokai', scheme: 'dark' },
  { id: 'night-owl', label: 'Night Owl', scheme: 'dark' },
  { id: 'solarized-dark', label: 'Solarized Dark', scheme: 'dark' },
  { id: 'solarized-light', label: 'Solarized Light', scheme: 'light' },
  { id: 'vscode-hc-black', label: 'High Contrast Black', scheme: 'dark', source: 'hc_black.json' },
  { id: 'vscode-hc-light', label: 'High Contrast Light', scheme: 'light', source: 'hc_light.json' },
] as const

export const themeIds = themes.map(({ id }) => id)
export const themeStorageKey = 'thtmnisamnstr-theme'
export const themeValues = {
  ...Object.fromEntries(themes.map(({ id }) => [id, id])),
  dark: 'vscode-dark-modern',
  light: 'vscode-light-modern',
}
export const darkThemeIds = new Set<string>(
  themes.filter(({ scheme }) => scheme === 'dark').map(({ id }) => id)
)

export function resolveTheme(theme?: string, systemTheme?: string) {
  if (!theme || theme === 'system')
    return systemTheme === 'light' ? themeValues.light : themeValues.dark
  return theme
}

// Runs in <head>, before content or next-themes, including with JS bundles blocked.
// Stored preferences are optional: denied storage still follows the OS preference.
export const themeBootstrap = `(() => {
  const themes = ${JSON.stringify(themes)};
  const root = document.documentElement;
  const system = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let theme = 'system';
  try {
    const saved = localStorage.getItem('${themeStorageKey}');
    const legacy = localStorage.getItem('theme');
    if (saved === 'system' || themes.some(t => t.id === saved)) theme = saved;
    else if (themes.some(t => t.id === legacy)) theme = legacy;
    if (saved !== theme) localStorage.setItem('${themeStorageKey}', theme);
  } catch {}
  const resolved = theme === 'system' ? 'vscode-' + system + '-modern' : theme;
  const scheme = themes.find(t => t.id === resolved)?.scheme || system;
  root.setAttribute('data-theme', resolved);
  root.classList.add(resolved);
  root.classList.toggle('dark', scheme === 'dark');
  root.style.colorScheme = scheme;
})();`

export const requiredWorkbenchTokens = [
  'foreground',
  'description-foreground',
  'editor-background',
  'editor-foreground',
  'editor-group-border',
  'activitybar-background',
  'activitybar-foreground',
  'activitybar-inactive-foreground',
  'activitybar-border',
  'activitybar-active-border',
  'sidebar-background',
  'sidebar-foreground',
  'sidebar-border',
  'sidebar-title-foreground',
  'sidebar-section-header-background',
  'sidebar-section-header-border',
  'breadcrumb-background',
  'breadcrumb-foreground',
  'breadcrumb-focus-foreground',
  'tab-active-background',
  'tab-active-foreground',
  'tab-inactive-background',
  'tab-inactive-foreground',
  'tab-hover-background',
  'tab-border',
  'tab-active-border-top',
  'statusbar-background',
  'statusbar-foreground',
  'statusbar-border',
  'statusbar-item-hover-background',
  'statusbar-item-focus-border',
  'focus-border',
  'input-background',
  'input-foreground',
  'input-border',
  'icon-foreground',
  'toolbar-hover-background',
  'command-center-background',
  'quick-input-background',
] as const

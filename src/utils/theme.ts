import { useDark, useToggle } from '@vueuse/core';
import { watch } from 'vue';

// Element Plus uses CSS variables for theming
// We'll set up a system that works with Element Plus's built-in dark mode
export function setupTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: 'light',
  });

  const toggleDark = useToggle(isDark);

  // Apply Element Plus dark mode
  watch(
    isDark,
    (dark) => {
      // Add or remove dark class to html element
      if (dark) {
        document.documentElement.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.setAttribute('data-theme', 'light');
      }
    },
    { immediate: true },
  );

  return {
    isDark,
    toggleDark,
  };
}

// Check if we have a stored theme
export function getStoredTheme(): string {
  return localStorage.getItem('theme') || 'light-theme';
}

// Set theme and store in localStorage
export function setTheme(theme: string): void {
  localStorage.setItem('theme', theme);
  document.body.className = theme;

  // Also toggle Element Plus dark mode
  if (theme === 'dark-theme') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

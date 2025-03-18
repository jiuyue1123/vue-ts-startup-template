import { useDark, useToggle } from '@vueuse/core';
import { watch, ref } from 'vue';

// 主题类型
export type ThemeMode = 'light-theme' | 'dark-theme' | 'auto';

// 主题变量接口
export interface ThemeVars {
  primaryColor: string;
  enableAnimations: boolean;
  menuCompact: boolean;
}

export const defaultThemeVars: ThemeVars = {
  primaryColor: '#409EFF',
  enableAnimations: true,
  menuCompact: false,
};

// 存储是否是暗色模式，供全局使用
export const isDarkMode = ref(false);

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

  // 更新暗色模式状态
  isDarkMode.value = isDark.value;

  // Apply Element Plus dark mode
  watch(
    isDark,
    (dark) => {
      // 更新暗色模式状态
      isDarkMode.value = dark;

      // Add or remove dark class to html element
      if (dark) {
        document.documentElement.classList.add('dark');
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.setAttribute('data-theme', 'light');
      }

      // 在模式变化时重新应用主题变量，以处理暗色模式下的特定样式
      const themeVars = getStoredThemeVars();
      applyThemeVars(themeVars);
    },
    { immediate: true },
  );

  // 监听系统颜色方案变化，处理auto模式
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDarkScheme.addEventListener('change', (e) => {
    const theme = getStoredTheme();
    if (theme === 'auto') {
      // 如果是自动模式，根据系统更新颜色
      if (e.matches) {
        document.documentElement.classList.add('dark');
        document.body.className = 'dark-theme';
        isDarkMode.value = true;
      } else {
        document.documentElement.classList.remove('dark');
        document.body.className = 'light-theme';
        isDarkMode.value = false;
      }

      // 重新应用主题变量
      const themeVars = getStoredThemeVars();
      applyThemeVars(themeVars);
    }
  });

  return {
    isDark,
    toggleDark,
  };
}

// 获取存储的主题模式
export function getStoredTheme(): ThemeMode {
  return (localStorage.getItem('theme') as ThemeMode) || 'light-theme';
}

// 获取存储的主题变量
export function getStoredThemeVars(): ThemeVars {
  try {
    const vars = localStorage.getItem('themeVars');
    return vars ? JSON.parse(vars) : defaultThemeVars;
  } catch (e) {
    console.error('解析主题变量时出错:', e);
    return defaultThemeVars;
  }
}

// 设置主题模式并存储
export function setTheme(theme: ThemeMode): void {
  localStorage.setItem('theme', theme);

  // 处理自动模式 (根据系统偏好)
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.className = prefersDark ? 'dark-theme' : 'light-theme';

    // Element Plus 暗色模式
    if (prefersDark) {
      document.documentElement.classList.add('dark');
      isDarkMode.value = true;
    } else {
      document.documentElement.classList.remove('dark');
      isDarkMode.value = false;
    }
    return;
  }

  // 处理明确的亮/暗模式
  document.body.className = theme;

  // 同时设置 Element Plus 暗色模式
  if (theme === 'dark-theme') {
    document.documentElement.classList.add('dark');
    isDarkMode.value = true;
  } else {
    document.documentElement.classList.remove('dark');
    isDarkMode.value = false;
  }
}

// 应用主题变量到CSS
function applyThemeVars(vars: ThemeVars): void {
  const root = document.documentElement;

  // 设置主题色
  root.style.setProperty('--primary-color', vars.primaryColor);

  // 为了完整，我们还需要设置与主色关联的其他颜色
  const primaryHoverColor = adjustColor(vars.primaryColor, 15, -3);
  const primaryActiveColor = adjustColor(vars.primaryColor, -15, 3);

  root.style.setProperty('--primary-hover', primaryHoverColor);
  root.style.setProperty('--primary-active', primaryActiveColor);

  // 应用Element Plus的主题色变量
  // 这确保Element Plus组件也使用自定义主题色
  root.style.setProperty('--el-color-primary', vars.primaryColor);
  root.style.setProperty('--el-color-primary-light-3', primaryHoverColor);
  root.style.setProperty('--el-color-primary-dark-2', primaryActiveColor);

  // 生成更多Element Plus主题相关颜色，同时降低饱和度
  for (let i = 1; i <= 9; i++) {
    // 对于浅色变种，我们降低饱和度，提高亮度
    const lightColor = adjustColor(vars.primaryColor, 10 * i, -5 * i);
    root.style.setProperty(`--el-color-primary-light-${i}`, lightColor);
  }

  // 设置动画
  if (!vars.enableAnimations) {
    root.style.setProperty('--transition-duration', '0s');
    root.classList.add('no-animations');
  } else {
    root.style.removeProperty('--transition-duration');
    root.classList.remove('no-animations');
  }

  // 设置菜单紧凑模式
  if (vars.menuCompact) {
    root.classList.add('menu-compact');
  } else {
    root.classList.remove('menu-compact');
  }

  // 处理黑色主题特殊样式
  if (vars.primaryColor.toLowerCase() === '#303133') {
    document.body.classList.add('black-theme');
  } else {
    document.body.classList.remove('black-theme');
  }
}

// 设置主题变量并存储
export function setThemeVars(vars: ThemeVars): void {
  // 应用主题变量
  applyThemeVars(vars);

  // 存储设置
  localStorage.setItem('themeVars', JSON.stringify(vars));
}

// 在RGB颜色上调整亮度和饱和度
function adjustColor(color: string, brightnessAmount: number, saturationAmount = 0): string {
  // 如果是十六进制颜色，转换为RGB
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // 转换为HSL
    const [h, s, l] = rgbToHsl(r, g, b);

    // 调整亮度和饱和度
    const newL = clamp(l + brightnessAmount / 255, 0, 1);

    // 对于高饱和度颜色进行特殊处理，降低更多饱和度
    let adjustedSaturation = saturationAmount;
    if (s > 0.7 && saturationAmount >= 0) {
      // 对于高饱和度颜色，进一步降低饱和度
      adjustedSaturation = saturationAmount - 5;
    }

    const newS = clamp(s + adjustedSaturation / 100, 0, 1);

    // 转回RGB
    const [newR, newG, newB] = hslToRgb(h, newS, newL);

    // 转回十六进制
    return `#${((newR << 16) | (newG << 8) | newB).toString(16).padStart(6, '0')}`;
  }

  // 为简单起见，如果不是十六进制颜色，返回原色
  return color;
}

// RGB 转 HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}

// HSL 转 RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    // 灰度
    r = l;
    g = l;
    b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// 限制数值在指定范围内
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// 应用存储的主题和变量
export function applyStoredTheme(): void {
  const theme = getStoredTheme();
  const vars = getStoredThemeVars();

  setTheme(theme);
  setThemeVars(vars);
}

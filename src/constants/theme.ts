/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const CategoryColors = {
  blue: {
    light: { background: '#DCEAFB', text: '#1D5FAE' },
    dark: { background: '#14263B', text: '#7AB8F5' },
  },
  green: {
    light: { background: '#DCF5E4', text: '#1B7A3D' },
    dark: { background: '#15301F', text: '#6FE3A0' },
  },
  yellow: {
    light: { background: '#FBF0C6', text: '#8A6D00' },
    dark: { background: '#3A3113', text: '#E8C55B' },
  },
  purple: {
    light: { background: '#EDE3FB', text: '#6B3FA0' },
    dark: { background: '#2C2140', text: '#C7A8F0' },
  },
  gray: {
    light: { background: '#F0F0F3', text: '#60646C' },
    dark: { background: '#212225', text: '#B0B4BA' },
  },
} as const;

export type CategoryColorKey = keyof typeof CategoryColors;

export function resolveCategoryColor(colorKey: string, scheme: 'light' | 'dark') {
  const key = (colorKey in CategoryColors ? colorKey : 'gray') as CategoryColorKey;
  return CategoryColors[key][scheme];
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useResolvedColorScheme(): 'light' | 'dark' {
  const scheme = useColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  return Colors[useResolvedColorScheme()];
}

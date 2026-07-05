import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { getDatabase } from '@/db/database';
import {
  configureNotificationHandler,
  ensureAndroidChannelAsync,
} from '@/notifications/notifications';

SplashScreen.preventAutoHideAsync();

configureNotificationHandler();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    getDatabase();
    ensureAndroidChannelAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="note/[id]" options={{ presentation: 'modal', title: 'Nota' }} />
      </Stack>
    </ThemeProvider>
  );
}

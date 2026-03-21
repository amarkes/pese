import './global.css';
import '@/utils/i18n';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { MainStackNavigator } from '@/navigation/MainStackNavigator';
import { linking } from '@/navigation/linking';
import { navigationRef } from '@/navigation/navigationRef';
import { NotificationNavigationService } from '@/services/NotificationNavigationService';
import { SettingsStorage } from '@/services/SettingsStorage';
import i18n from '@/utils/i18n';

export default function App() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const settings = await SettingsStorage.getSettings();

        if (!isMounted) {
          return;
        }

        await i18n.changeLanguage(settings.language);
        setColorScheme(settings.themeMode);
      } catch (error) {
        console.error('Error loading app preferences:', error);
      } finally {
        if (isMounted) {
          setIsAppReady(true);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setColorScheme]);

  useEffect(() => {
    NotificationNavigationService.start();

    return () => {
      NotificationNavigationService.stop();
    };
  }, []);

  if (!isAppReady) {
    return <GestureHandlerRootView style={styles.root} />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar 
          barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
          backgroundColor={isDarkMode ? '#1C1C1E' : '#F2F2F7'} 
        />
        <NavigationContainer
          ref={navigationRef}
          linking={linking}
          theme={isDarkMode ? DarkTheme : DefaultTheme}
          onReady={() => NotificationNavigationService.flushPendingNavigation()}
        >
          <MainStackNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

import './global.css';
import '@/utils/i18n';
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { TabNavigator } from '@/navigation/TabNavigator';

export default function App() {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#1C1C1E' : '#F2F2F7'} 
      />
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <TabNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

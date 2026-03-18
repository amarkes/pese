import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { LayoutGrid, History, Settings, Plus, Activity } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import { HistoryScreen } from '@/screens/history/HistoryScreen';
import SettingsScreen from '@/screens/settings';

const Tab = createBottomTabNavigator();

const CustomTabButton = ({ onPress }: any) => (
  <TouchableOpacity
    style={styles.customTabButton}
    onPress={onPress}
  >
    <View
      style={styles.addButtonInner}
      className="items-center justify-center"
    >
      <Plus size={32} color="white" strokeWidth={3} />
    </View>
  </TouchableOpacity>
);

const HomeIcon = ({ color, size }: any) => <LayoutGrid size={size} color={color} />;
const HistoryIcon = ({ color, size }: any) => <History size={size} color={color} />;
const MetasIcon = ({ color, size }: any) => <Activity size={size} color={color} />; // Using Activity for now as requested
const SettingsIcon = ({ color, size }: any) => <Settings size={size} color={color} />;

const AddButton = (props: any) => (
  <CustomTabButton {...props} onPress={() => console.log('Novo Registro')} />
);

export const TabNavigator = () => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{

        headerShown: false,
        tabBarStyle: {
          height: 90,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? '#1E293B' : '#F2F2F7',
          backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDarkMode ? '#8E8E93' : '#6C6C70',

        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter_18pt-Bold',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarLabel: t('tabs.home'),
          tabBarIcon: HomeIcon,
        }}
      />
      <Tab.Screen
        name="Metas"
        component={SettingsScreen} // As requested: Metas leads to Settings
        options={{
          tabBarLabel: t('tabs.metas'),
          tabBarIcon: MetasIcon,
        }}
      />
      <Tab.Screen
        name="Add"
        component={DashboardScreen}
        options={{
          tabBarButton: AddButton,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: t('tabs.history'),
          tabBarIcon: HistoryIcon,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen} // Also putting Settings here as in the image
        options={{
          tabBarLabel: t('tabs.settings'),
          tabBarIcon: SettingsIcon,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  customTabButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  addButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
  },
});

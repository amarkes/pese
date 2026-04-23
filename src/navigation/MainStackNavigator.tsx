import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { RegisterWeightScreen } from '@/screens/weight';
import { RegisterGlucoseScreen } from '@/screens/glucose';
import { RegisterWaterScreen } from '@/screens/water/index';
import { RegisterBloodPressureScreen } from '@/screens/blood-pressure';
import { StatisticsScreen } from '@/screens/statistics';
import SettingsScreen from '@/screens/settings';
import DataTransferScreen from '@/screens/data-transfer';
import HelpScreen from '@/screens/help';
import PrivacyPolicyScreen from '@/screens/privacy-policy';

const Stack = createNativeStackNavigator();

export const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen 
        name="RegisterWeight" 
        component={RegisterWeightScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="RegisterGlucose" 
        component={RegisterGlucoseScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="RegisterWater" 
        component={RegisterWaterScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="RegisterBloodPressure"
        component={RegisterBloodPressureScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="AppSettings"
        component={SettingsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="DataTransfer"
        component={DataTransferScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="HelpCenter"
        component={HelpScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

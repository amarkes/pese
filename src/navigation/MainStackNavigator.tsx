import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { RegisterWeightScreen } from '@/screens/weight';
import { RegisterGlucoseScreen } from '@/screens/glucose';
import { RegisterWaterScreen } from '@/screens/water/index';

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
    </Stack.Navigator>
  );
};

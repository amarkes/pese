import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { RegisterWeightScreen } from '@/screens/weight/RegisterWeightScreen';
import { RegisterGlucoseScreen } from '@/screens/glucose/RegisterGlucoseScreen';

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
    </Stack.Navigator>
  );
};

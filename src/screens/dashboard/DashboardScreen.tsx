import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickActionsSection } from './components/QuickActionsSection';
import { SummarySection } from './components/SummarySection';
import { TrendSection } from './components/TrendSection';

const DashboardScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 pt-4">
        
        <QuickActionsSection />
        <SummarySection />
        <TrendSection />

        {/* Extra space for scrolling */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;


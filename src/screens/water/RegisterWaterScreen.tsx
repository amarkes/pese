import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Typography } from '@/components/atoms/Typography';
import { useWaterRegistration } from './hooks/useWaterRegistration';

import { WaterProgressCircle } from './components/WaterProgressCircle';
import { QuickAddSection } from './components/QuickAddSection';
import { ManualEntrySection } from './components/ManualEntrySection';
import { RecentActivityCard } from './components/RecentActivityCard';

export const RegisterWaterScreen: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const {
    manualAmount,
    setManualAmount,
    todayRecords,
    dailyGoal,
    totalConsumed,
    percentage,
    handleAddWater,
    handleManualAdd,
    handleDelete,
    handleUpdateWater,
    formatTime,
    t,
    navigation
  } = useWaterRegistration();

  const [editingRecord, setEditingRecord] = useState<any>(null);

  const startEdit = (record: any) => {
    setEditingRecord(record);
    setManualAmount(record.amount.toString());
  };

  const submitManual = () => {
    if (editingRecord) {
      const amt = parseInt(manualAmount, 10);
      if (!isNaN(amt) && amt > 0) {
        handleUpdateWater(editingRecord.id, amt);
      }
      setEditingRecord(null);
      setManualAmount('');
    } else {
      handleManualAdd();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 justify-between border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
        >
          <ChevronLeft size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold text-slate-900 dark:text-white">
          {t('water.title')}
        </Typography>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6" contentContainerClassName="py-6 pb-24">
          
          <WaterProgressCircle 
            totalConsumed={totalConsumed}
            dailyGoal={dailyGoal}
            percentage={percentage}
            isDarkMode={isDarkMode}
            t={t}
          />

          <QuickAddSection 
            onAdd={handleAddWater}
            isDarkMode={isDarkMode}
            t={t}
          />

          <ManualEntrySection 
            manualAmount={manualAmount}
            setManualAmount={setManualAmount}
            onSubmit={submitManual}
            isEditing={!!editingRecord}
            isDarkMode={isDarkMode}
            t={t}
          />

          {/* Recent Activity */}
          <View>
            <View className="flex-row items-center justify-between mb-4 mt-2">
              <Typography variant="label" className="text-slate-400 dark:text-slate-500 tracking-widest uppercase text-xs">
                {t('water.recentActivity')}
              </Typography>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Typography className="text-blue-600 dark:text-blue-500 font-outfit-bold text-sm">
                  {t('water.seeAll')}
                </Typography>
              </TouchableOpacity>
            </View>
            
            {todayRecords.map((record) => (
              <RecentActivityCard 
                key={record.id} 
                record={record} 
                onDelete={handleDelete} 
                onEdit={startEdit}
                formatTime={formatTime} 
                isDarkMode={isDarkMode} 
              />
            ))}
            
            {todayRecords.length === 0 && (
              <View className="items-center py-6">
                <Typography className="text-slate-400 dark:text-slate-500 font-outfit">
                  Nenhum registro ainda hoje.
                </Typography>
              </View>
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/atoms/Typography';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import { ChevronLeft } from 'lucide-react-native';
import { WeightStats } from './WeightStats';
import { GlucoseStats } from './GlucoseStats';
import { WaterStats } from './WaterStats';
import { BloodPressureStats } from './BloodPressureStats';

type MetricTab = 'weight' | 'glucose' | 'water' | 'bloodPressure';

const TABS: { key: MetricTab; labelKey: string; activeClass: string }[] = [
  { key: 'weight',        labelKey: 'common.weight',        activeClass: 'bg-indigo-500' },
  { key: 'glucose',       labelKey: 'common.glucose',       activeClass: 'bg-rose-500'   },
  { key: 'water',         labelKey: 'common.water',         activeClass: 'bg-sky-500'    },
  { key: 'bloodPressure', labelKey: 'common.bloodPressure', activeClass: 'bg-red-500'    },
];

export const StatisticsScreen = () => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation<any>();
  const [activeMetric, setActiveMetric] = useState<MetricTab>('weight');

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950" edges={['top']}>
      {/* Header with back button */}
      <View className="flex-row items-center px-4 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 mr-3"
        >
          <ChevronLeft size={22} color={isDark ? '#60A5FA' : '#3B82F6'} />
        </TouchableOpacity>
        <Typography className="text-2xl font-outfit-bold text-slate-900 dark:text-white">
          {t('statistics.title')}
        </Typography>
      </View>

      {/* Metric tabs — scrollable row to fit 4 items */}
      <View className="px-4 pt-4 pb-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveMetric(tab.key)}
              className={`flex-1 py-2 rounded-lg items-center ${
                activeMetric === tab.key ? tab.activeClass : ''
              }`}
            >
              <Typography
                className={`text-xs font-outfit-bold ${
                  activeMetric === tab.key ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t(tab.labelKey)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-1">
        {activeMetric === 'weight'        && <WeightStats />}
        {activeMetric === 'glucose'       && <GlucoseStats />}
        {activeMetric === 'water'         && <WaterStats />}
        {activeMetric === 'bloodPressure' && <BloodPressureStats />}
      </View>
    </SafeAreaView>
  );
};

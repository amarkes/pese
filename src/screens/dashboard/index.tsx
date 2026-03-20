import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { WeightRecord, WeightStorage } from '@/services/WeightStorage';
import { GlucoseStorage } from '@/services/GlucoseStorage';
import { SettingsStorage } from '@/services/SettingsStorage';
import { WaterStorage } from '@/services/WaterStorage';

import { QuickActionsSection } from './components/QuickActionsSection';
import { SummarySection } from './components/SummarySection';
import { TrendSection } from './components/TrendSection';

const formatWeight = (value?: number) => (typeof value === 'number' ? value.toFixed(1) : '--');

const getChangeTone = (value: number): 'positive' | 'negative' | 'neutral' => {
  if (value > 0) return 'positive';
  if (value < 0) return 'negative';
  return 'neutral';
};

const isSameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

const sortByDateDesc = <T extends { date: string }>(items: T[]) =>
  [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const getWeightForDate = (weights: WeightRecord[], targetDate: Date) => {
  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);
  return weights.find(record => new Date(record.date).getTime() <= endOfDay.getTime())?.weight;
};

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState({
    lastWeight: '--',
    weightDiff: null as string | null,
    weightDiffTone: 'neutral' as 'positive' | 'negative' | 'neutral',
    glucoseValue: '--',
    glucoseTargetMin: 81,
    glucoseTargetMax: 92,
    waterConsumed: 0,
    waterGoal: 2500,
    waterProgress: 0,
  });
  const [trend, setTrend] = useState({
    labels: [] as string[],
    data: [] as number[],
    currentWeight: '--',
    changeLabel: null as string | null,
    changeTone: 'neutral' as 'positive' | 'negative' | 'neutral',
    hasData: false,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    }

    try {
      const [weightRecords, glucoseRecords, waterRecords, settings] = await Promise.all([
        WeightStorage.getRecords(),
        GlucoseStorage.getRecords(),
        WaterStorage.getRecords(),
        SettingsStorage.getSettings(),
      ]);

      const sortedWeights = sortByDateDesc(weightRecords);
      const sortedGlucose = sortByDateDesc(glucoseRecords);
      const latestWeight = sortedWeights[0];
      const previousWeight = sortedWeights[1];
      const latestGlucose = sortedGlucose[0];
      const waterGoal = parseInt(settings.waterGoal, 10) || 2500;
      const now = new Date();

      const todayWater = waterRecords
        .filter(record => isSameDay(new Date(record.date), now))
        .reduce((total, record) => total + record.amount, 0);

      const weightDelta =
        latestWeight && previousWeight ? latestWeight.weight - previousWeight.weight : null;

      setSummary({
        lastWeight: formatWeight(latestWeight?.weight),
        weightDiff: weightDelta === null ? null : `${weightDelta > 0 ? '+' : ''}${weightDelta.toFixed(1)}`,
        weightDiffTone: weightDelta === null ? 'neutral' : getChangeTone(weightDelta),
        glucoseValue: latestGlucose ? `${latestGlucose.glucose}` : '--',
        glucoseTargetMin: parseInt(settings.glucoseNormalMin, 10) || 81,
        glucoseTargetMax: parseInt(settings.glucoseNormalMax, 10) || 92,
        waterConsumed: todayWater,
        waterGoal,
        waterProgress: waterGoal > 0 ? Math.min(todayWater / waterGoal, 1) : 0,
      });

      const dayLabels = t('dashboard.days', { returnObjects: true }) as string[];
      const lastSevenDays = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (6 - index));
        return date;
      });

      if (sortedWeights.length === 0) {
        setTrend({
          labels: lastSevenDays.map(date => dayLabels[date.getDay()]),
          data: [],
          currentWeight: '--',
          changeLabel: null,
          changeTone: 'neutral',
          hasData: false,
        });
        return;
      }

      const trendValues = lastSevenDays.map(date => {
        const value = getWeightForDate(sortedWeights, date);
        return Number((value ?? sortedWeights[sortedWeights.length - 1].weight).toFixed(1));
      });

      const firstValue = trendValues[0];
      const lastValue = trendValues[trendValues.length - 1];
      const percentChange =
        firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

      setTrend({
        labels: lastSevenDays.map(date => dayLabels[date.getDay()]),
        data: trendValues,
        currentWeight: formatWeight(latestWeight?.weight),
        changeLabel: `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%`,
        changeTone: getChangeTone(percentChange),
        hasData: true,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      if (showRefreshing) {
        setRefreshing(false);
      }
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const handleRefresh = useCallback(() => {
    loadDashboardData(true);
  }, [loadDashboardData]);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 pt-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        
        <QuickActionsSection />
        <SummarySection
          lastWeight={summary.lastWeight}
          weightDiff={summary.weightDiff}
          weightDiffTone={summary.weightDiffTone}
          glucoseValue={summary.glucoseValue}
          glucoseTargetMin={summary.glucoseTargetMin}
          glucoseTargetMax={summary.glucoseTargetMax}
          waterConsumed={summary.waterConsumed}
          waterGoal={summary.waterGoal}
          waterProgress={summary.waterProgress}
        />
        <TrendSection
          labels={trend.labels}
          data={trend.data}
          currentWeight={trend.currentWeight}
          changeLabel={trend.changeLabel}
          changeTone={trend.changeTone}
          hasData={trend.hasData}
        />

        {/* Extra space for scrolling */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

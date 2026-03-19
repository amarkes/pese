import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '@/components/atoms/Typography';
import { useTranslation } from 'react-i18next';
import { WeightStorage } from '@/services/WeightStorage';
import { GlucoseStorage } from '@/services/GlucoseStorage';
import { WaterStorage } from '@/services/WaterStorage';
import { SettingsStorage } from '@/services/SettingsStorage';
import { PeriodSelector } from './components/PeriodSelector';
import { DataInclusionSelector } from './components/DataInclusionSelector';
import { ExportSummary } from './components/ExportSummary';
import { ReportSummary } from './components/ReportSummary';
import { ExportActions } from './components/ExportActions';

export const ReportsScreen = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState(30);
  const [dataIncluded, setDataIncluded] = useState({ weight: true, glucose: true, water: true });

  const [stats, setStats] = useState({
    totalRecords: 0,
    weightAvg: 0,
    weightGoal: 0,
    glucoseAvg: 0,
    waterAvg: 0,
    waterGoal: 0,
    startDate: '',
    endDate: '',
  });

  const loadData = useCallback(async () => {
    try {
      const weights = await WeightStorage.getRecords();
      const glucoses = await GlucoseStorage.getRecords();
      const waters = await WaterStorage.getRecords();
      const settings = await SettingsStorage.getSettings();

      const now = new Date();
      const past = new Date();
      past.setDate(now.getDate() - period);

      const fWeights = weights.filter(w => new Date(w.date) >= past);
      const fGlucoses = glucoses.filter(g => new Date(g.date) >= past);
      const fWaters = waters.filter(w => new Date(w.date) >= past);

      const weightAvg = fWeights.length ? fWeights.reduce((a, b) => a + b.weight, 0) / fWeights.length : 0;
      const glucoseAvg = fGlucoses.length ? fGlucoses.reduce((a, b) => a + b.glucose, 0) / fGlucoses.length : 0;
      const waterSum = fWaters.reduce((a, b) => a + b.amount, 0);
      const waterAvg = period > 0 ? waterSum / period : 0;

      setStats({
        totalRecords: fWeights.length + fGlucoses.length + fWaters.length,
        weightAvg,
        weightGoal: Number(settings.weightGoal) || 0,
        glucoseAvg,
        waterAvg,
        waterGoal: Number(settings.waterGoal) || 2000,
        startDate: past.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        endDate: now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      });
    } catch (e) {
      console.error(e);
    }
  }, [period]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleInclude = (key: keyof typeof dataIncluded) => {
    setDataIncluded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Typography className="text-2xl font-outfit-bold text-slate-900 dark:text-white">
          {t('reports.title')}
        </Typography>
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <PeriodSelector period={period} setPeriod={setPeriod} />
        <DataInclusionSelector dataIncluded={dataIncluded} toggleInclude={toggleInclude} />
        <ExportSummary
          startDate={stats.startDate}
          endDate={stats.endDate}
          totalRecords={stats.totalRecords}
        />
        <ReportSummary dataIncluded={dataIncluded} stats={stats} />
        <ExportActions />
      </ScrollView>
    </SafeAreaView>
  );
};

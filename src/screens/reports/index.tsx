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
import { DateRangeModal } from './components/DateRangeModal';

type PeriodMode = 'last30' | 'thisMonth' | 'custom';

export const ReportsScreen = () => {
  const { t, i18n } = useTranslation();
  const fmt = useCallback(
    (d: Date) => d.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit' }),
    [i18n.language]
  );

  // Period state
  const [periodMode, setPeriodMode] = useState<PeriodMode>('last30');
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);

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

  // Derive the actual date range from the current mode
  const getDateRange = useCallback((): { past: Date; now: Date } => {
    const now = new Date();
    if (periodMode === 'custom' && customStart && customEnd) {
      return { past: customStart, now: customEnd };
    }
    const past = new Date();
    if (periodMode === 'thisMonth') {
      past.setDate(1); // first day of current month
      past.setHours(0, 0, 0, 0);
    } else {
      past.setDate(now.getDate() - 30);
    }
    return { past, now };
  }, [periodMode, customStart, customEnd]);

  const loadData = useCallback(async () => {
    try {
      const weights = await WeightStorage.getRecords();
      const glucoses = await GlucoseStorage.getRecords();
      const waters = await WaterStorage.getRecords();
      const settings = await SettingsStorage.getSettings();

      const { past, now } = getDateRange();
      const daySpan = Math.max(1, Math.round((now.getTime() - past.getTime()) / 86400000));

      const fWeights = weights.filter(w => new Date(w.date) >= past && new Date(w.date) <= now);
      const fGlucoses = glucoses.filter(g => new Date(g.date) >= past && new Date(g.date) <= now);
      const fWaters = waters.filter(w => new Date(w.date) >= past && new Date(w.date) <= now);

      const weightAvg = fWeights.length ? fWeights.reduce((a, b) => a + b.weight, 0) / fWeights.length : 0;
      const glucoseAvg = fGlucoses.length ? fGlucoses.reduce((a, b) => a + b.glucose, 0) / fGlucoses.length : 0;
      const waterSum = fWaters.reduce((a, b) => a + b.amount, 0);
      const waterAvg = waterSum / daySpan;

      setStats({
        totalRecords: fWeights.length + fGlucoses.length + fWaters.length,
        weightAvg,
        weightGoal: Number(settings.weightGoal) || 0,
        glucoseAvg,
        waterAvg,
        waterGoal: Number(settings.waterGoal) || 2000,
        startDate: fmt(past),
        endDate: fmt(now),
      });
    } catch (e) {
      console.error(e);
    }
  }, [fmt, getDateRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleInclude = (key: keyof typeof dataIncluded) => {
    setDataIncluded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePeriodSet = (mode: PeriodMode) => {
    setPeriodMode(mode);
    if (mode === 'custom') {
      setCustomStart(null);
      setCustomEnd(null);
    }
  };

  const handleCustomConfirm = (start: Date, end: Date) => {
    setCustomStart(start);
    setCustomEnd(end);
    setPeriodMode('custom');
  };

  // Map periodMode to a number value that PeriodSelector uses for highlight
  const periodValue = periodMode === 'last30' ? 30 : periodMode === 'thisMonth' ? new Date().getDate() : -1;

  const customLabel =
    periodMode === 'custom' && customStart && customEnd
      ? `${fmt(customStart)} – ${fmt(customEnd)}`
      : undefined;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Typography className="text-2xl font-outfit-bold text-slate-900 dark:text-white">
          {t('reports.title')}
        </Typography>
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <PeriodSelector
          period={periodValue}
          setPeriod={(v) => {
            if (v === 30) handlePeriodSet('last30');
            else handlePeriodSet('thisMonth');
          }}
          isCustom={periodMode === 'custom'}
          customLabel={customLabel}
          onCustomPress={() => setShowDateModal(true)}
        />
        <DataInclusionSelector dataIncluded={dataIncluded} toggleInclude={toggleInclude} />
        <ExportSummary
          startDate={stats.startDate}
          endDate={stats.endDate}
          totalRecords={stats.totalRecords}
        />
        <ReportSummary dataIncluded={dataIncluded} stats={stats} />
        <ExportActions stats={stats} dataIncluded={dataIncluded} />
      </ScrollView>

      <DateRangeModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        onConfirm={handleCustomConfirm}
      />
    </SafeAreaView>
  );
};

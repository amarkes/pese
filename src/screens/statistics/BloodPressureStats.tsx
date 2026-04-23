import React, { useState, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { DeviationBar } from '@/components/molecules/DeviationBar';
import { WeekdayDeviationSection } from '@/components/organisms/WeekdayDeviationSection';
import {
  BloodPressureStorage,
  BloodPressureRecord,
  BPCategory,
  classifyBP,
  isHealthyBP,
} from '@/services/BloodPressureStorage';

type Period = 'all' | '7d' | '30d' | '12m';

const CAT_ORDER: BPCategory[] = ['low', 'normal', 'elevated', 'hyp1', 'hyp2', 'crisis'];

const CAT_COLORS: Record<BPCategory, string> = {
  low: '#60A5FA',
  normal: '#10B981',
  elevated: '#84CC16',
  hyp1: '#F59E0B',
  hyp2: '#F97316',
  crisis: '#EF4444',
};

function getCutoff(period: Period): Date | null {
  if (period === 'all') return null;
  const d = new Date();
  if (period === '7d') d.setDate(d.getDate() - 7);
  else if (period === '30d') d.setDate(d.getDate() - 30);
  else d.setFullYear(d.getFullYear() - 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getHour(date: string): number {
  return new Date(date).getHours();
}

function getTimeOfDay(hour: number): 'morning' | 'afternoon' | 'night' {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
}

interface ProgressRingProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  pct,
  size = 200,
  strokeWidth = 18,
  color = '#10B981',
  trackColor = '#E2E8F0',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - Math.min(1, Math.max(0, pct / 100)));
  const cx = size / 2;
  const cy = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <Circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </Svg>
  );
};


export const BloodPressureStats: React.FC = () => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [period, setPeriod] = useState<Period>('30d');
  const [allRecords, setAllRecords] = useState<BloodPressureRecord[]>([]);

  useEffect(() => {
    BloodPressureStorage.getRecords().then(r => setAllRecords(r));
  }, []);

  const records = useMemo(() => {
    const cutoff = getCutoff(period);
    const filtered = cutoff
      ? allRecords.filter(r => new Date(r.date) >= cutoff)
      : allRecords;
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [allRecords, period]);

  const total = records.length;
  const healthyCount = records.filter(r => isHealthyBP(r.systolic, r.diastolic)).length;
  const healthyPct = total > 0 ? Math.round((healthyCount / total) * 100) : 0;

  const avgSystolic = total > 0 ? records.reduce((s, r) => s + r.systolic, 0) / total : 0;
  const avgDiastolic = total > 0 ? records.reduce((s, r) => s + r.diastolic, 0) / total : 0;
  const avgCategory = total > 0 ? classifyBP(Math.round(avgSystolic), Math.round(avgDiastolic)) : null;

  // Category distribution
  const catCounts = CAT_ORDER.reduce((acc, cat) => {
    acc[cat] = records.filter(r => classifyBP(r.systolic, r.diastolic) === cat).length;
    return acc;
  }, {} as Record<BPCategory, number>);

  // Time of day deviation
  const timeGroups: Record<'morning' | 'afternoon' | 'night', number[]> = {
    morning: [], afternoon: [], night: [],
  };
  records.forEach(r => {
    const tod = getTimeOfDay(getHour(r.date));
    timeGroups[tod].push(r.systolic);
  });
  const todAvgs = {
    morning: timeGroups.morning.length
      ? timeGroups.morning.reduce((a, b) => a + b, 0) / timeGroups.morning.length : null,
    afternoon: timeGroups.afternoon.length
      ? timeGroups.afternoon.reduce((a, b) => a + b, 0) / timeGroups.afternoon.length : null,
    night: timeGroups.night.length
      ? timeGroups.night.reduce((a, b) => a + b, 0) / timeGroups.night.length : null,
  };
  const todDevs = {
    morning: avgSystolic > 0 && todAvgs.morning !== null
      ? ((todAvgs.morning - avgSystolic) / avgSystolic) * 100 : 0,
    afternoon: avgSystolic > 0 && todAvgs.afternoon !== null
      ? ((todAvgs.afternoon - avgSystolic) / avgSystolic) * 100 : 0,
    night: avgSystolic > 0 && todAvgs.night !== null
      ? ((todAvgs.night - avgSystolic) / avgSystolic) * 100 : 0,
  };

  const maxTodAbs = Math.max(...Object.values(todDevs).map(Math.abs), 0.01);

  const PERIODS: Period[] = ['all', '7d', '30d', '12m'];
  const PERIOD_LABELS: Record<Period, string> = {
    all: t('bpStats.periodAll'),
    '7d': t('bpStats.period7d'),
    '30d': t('bpStats.period30d'),
    '12m': t('bpStats.period12m'),
  };
  const CAT_LABELS: Record<BPCategory, string> = {
    low: t('bloodPressure.catLow'),
    normal: t('bloodPressure.catNormal'),
    elevated: t('bloodPressure.catElevated'),
    hyp1: t('bloodPressure.catHyp1'),
    hyp2: t('bloodPressure.catHyp2'),
    crisis: t('bloodPressure.catCrisis'),
  };

  const trackColor = isDark ? '#1E293B' : '#E2E8F0';

  if (total === 0) {
    return (
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Period selector */}
        <View className="flex-row gap-2 mb-4 flex-wrap">
          {PERIODS.map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full border ${
                period === p ? 'bg-rose-500 border-rose-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <Typography className={`text-xs font-outfit-bold ${period === p ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {PERIOD_LABELS[p]}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
        <View className="items-center justify-center py-20">
          <Typography className="text-slate-400 font-outfit text-sm text-center">
            {t('bpStats.noData')}
          </Typography>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      {/* Period selector */}
      <View className="flex-row gap-2 mb-4 flex-wrap">
        {PERIODS.map(p => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full border ${
              period === p ? 'bg-rose-500 border-rose-500' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <Typography className={`text-xs font-outfit-bold ${period === p ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
              {PERIOD_LABELS[p]}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ring chart + category distribution */}
      <Card className="mb-3">
        <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-4">
          {t('bpStats.allMeasurements')}
        </Typography>

        {/* Ring + percentage */}
        <View className="items-center mb-4">
          <View style={{ position: 'relative', width: 200, height: 200 }}>
            <ProgressRing pct={healthyPct} color="#10B981" trackColor={trackColor} />
            <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
              <Typography className="text-5xl font-outfit-bold text-slate-800 dark:text-white">
                {healthyPct}%
              </Typography>
              <Typography className="text-xs font-outfit text-slate-400 text-center px-8 mt-1">
                {t('bpStats.healthyPct')}
              </Typography>
            </View>
          </View>
        </View>

        {/* Category bars */}
        {CAT_ORDER.filter(cat => catCounts[cat] > 0).map(cat => {
          const pct = total > 0 ? Math.round((catCounts[cat] / total) * 100) : 0;
          return (
            <View key={cat} className="flex-row items-center mb-2">
              <View className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: CAT_COLORS[cat] }} />
              <Typography className="text-sm font-outfit text-slate-600 dark:text-slate-300" style={{ width: 130 }}>
                {CAT_LABELS[cat]}
              </Typography>
              <View className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mr-2">
                <View
                  className="h-2 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: CAT_COLORS[cat] }}
                />
              </View>
              <Typography className="text-xs font-outfit-bold text-slate-500 dark:text-slate-400 w-9 text-right">
                {pct}%
              </Typography>
            </View>
          );
        })}
      </Card>

      {/* Visão geral */}
      <Card className="mb-3">
        <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-3">
          {t('bpStats.overview')}
        </Typography>
        <View className="flex-row items-center py-2 border-b border-slate-50 dark:border-slate-800">
          <View className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950 items-center justify-center mr-3">
            <Typography className="text-lg">❤️</Typography>
          </View>
          <View className="flex-1">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500">
              {t('bpStats.totalMeasurements')}
            </Typography>
            <Typography className="text-2xl font-outfit-bold text-slate-800 dark:text-white">
              {total}
            </Typography>
          </View>
        </View>
        <View className="flex-row items-center py-2 border-b border-slate-50 dark:border-slate-800">
          <View className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950 items-center justify-center mr-3">
            <Typography className="text-lg">✅</Typography>
          </View>
          <View className="flex-1">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500">
              {t('bpStats.healthyMeasurements')}
            </Typography>
            <Typography className="text-2xl font-outfit-bold text-emerald-500">
              {healthyPct}%
            </Typography>
          </View>
        </View>
        <View className="flex-row items-center py-2">
          <View className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center mr-3">
            <Typography className="text-lg">📊</Typography>
          </View>
          <View className="flex-1">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500">
              {t('bpStats.avgPressure')}
            </Typography>
            <View className="flex-row items-center gap-2">
              <Typography className="text-2xl font-outfit-bold text-slate-800 dark:text-white">
                {Math.round(avgSystolic)}/{Math.round(avgDiastolic)}
                <Typography className="text-sm font-outfit text-slate-400"> mmHg</Typography>
              </Typography>
              {avgCategory && (
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${CAT_COLORS[avgCategory]}20` }}
                >
                  <Typography className="text-xs font-outfit-bold" style={{ color: CAT_COLORS[avgCategory] }}>
                    {CAT_LABELS[avgCategory]}
                  </Typography>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>

      {/* Variação - apenas período do dia */}
      {total >= 3 && (
        <Card className="mb-6">
          <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-1">
            {t('bpStats.variation')}
          </Typography>
          <Typography className="text-xs font-outfit text-slate-400 mb-4">
            {t('bpStats.variationSub')}
          </Typography>

          <Typography className="text-sm font-outfit-bold text-slate-700 dark:text-slate-200 mb-3">
            {t('bpStats.timeOfDay')}
          </Typography>
          {(
            [
              { key: 'morning', label: t('bpStats.morning'), sub: t('bpStats.morningHours') },
              { key: 'afternoon', label: t('bpStats.afternoon'), sub: t('bpStats.afternoonHours') },
              { key: 'night', label: t('bpStats.night'), sub: t('bpStats.nightHours') },
            ] as const
          ).map(({ key, label, sub }) => (
            timeGroups[key].length > 0 ? (
              <DeviationBar
                key={key}
                label={label}
                sub={sub}
                pct={todDevs[key]}
                maxAbs={maxTodAbs}
              />
            ) : null
          ))}
        </Card>
      )}

      {/* Dia da semana - seção standalone, sempre exibida */}
      <WeekdayDeviationSection
        titleKey="bpStats.dayOfWeek"
        records={records}
        getValue={r => r.systolic}
        getDate={r => r.date}
      />

      <View className="h-6" />
    </ScrollView>
  );
};

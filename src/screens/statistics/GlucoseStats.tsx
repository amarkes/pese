import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { WeekdayDeviationSection } from '@/components/organisms/WeekdayDeviationSection';
import { GlucoseStorage, GlucoseRecord } from '@/services/GlucoseStorage';
import { SettingsStorage } from '@/services/SettingsStorage';

type Period = '7d' | '30d' | '3m';
type MeasurementType = 'all' | 'fasting' | 'preMeal' | 'postMeal' | 'random';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 48;
const MAX_LABELS = 6;

function getCutoff(period: Period): Date {
  const d = new Date();
  if (period === '7d') d.setDate(d.getDate() - 7);
  else if (period === '30d') d.setDate(d.getDate() - 30);
  else d.setMonth(d.getMonth() - 3);
  d.setHours(0, 0, 0, 0);
  return d;
}

function sparseLabels(labels: string[]): string[] {
  if (labels.length <= MAX_LABELS) return labels;
  const step = Math.ceil((labels.length - 1) / (MAX_LABELS - 1));
  return labels.map((l, i) =>
    i === 0 || i === labels.length - 1 || i % step === 0 ? l : ''
  );
}

interface GlucoseRanges {
  normalMin: number;
  normalMax: number;
  preMin: number;
  preMax: number;
}

function classifyGlucose(value: number, ranges: GlucoseRanges) {
  if (value < ranges.normalMin) return 'below';
  if (value <= ranges.normalMax) return 'normal';
  if (value <= ranges.preMax) return 'pre';
  return 'above';
}

export const GlucoseStats = () => {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [period, setPeriod] = useState<Period>('30d');
  const [typeFilter, setTypeFilter] = useState<MeasurementType>('all');
  const [allRecords, setAllRecords] = useState<GlucoseRecord[]>([]);
  const [ranges, setRanges] = useState<GlucoseRanges>({
    normalMin: 70,
    normalMax: 100,
    preMin: 100,
    preMax: 125,
  });

  const fmt = useCallback(
    (d: Date) => d.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit' }),
    [i18n.language]
  );

  // Fetch ranges once on mount
  useEffect(() => {
    SettingsStorage.getSettings().then(s => {
      setRanges({
        normalMin: Number(s.glucoseNormalMin) || 70,
        normalMax: Number(s.glucoseNormalMax) || 100,
        preMin: Number(s.glucosePreMin) || 100,
        preMax: Number(s.glucosePreMax) || 125,
      });
    });
  }, []);

  // Fetch records when period changes
  useEffect(() => {
    const load = async () => {
      const all = await GlucoseStorage.getRecords();
      const cutoff = getCutoff(period);
      const filtered = all
        .filter(r => new Date(r.date) >= cutoff)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setAllRecords(filtered);
    };
    load();
  }, [period]);

  const filtered =
    typeFilter === 'all'
      ? allRecords
      : allRecords.filter(r => r.measurementType === typeFilter);

  const hasData = filtered.length >= 2;
  const avg = filtered.length
    ? filtered.reduce((s, r) => s + r.glucose, 0) / filtered.length
    : 0;
  const min = filtered.length ? Math.min(...filtered.map(r => r.glucose)) : 0;
  const max = filtered.length ? Math.max(...filtered.map(r => r.glucose)) : 0;

  const labels = sparseLabels(filtered.map(r => fmt(new Date(r.date))));
  const points = filtered.map(r => r.glucose);

  // Range distribution
  const classified = allRecords.map(r => classifyGlucose(r.glucose, ranges));
  const inRange = classified.filter(c => c === 'normal').length;
  const above = classified.filter(c => c === 'above' || c === 'pre').length;
  const below = classified.filter(c => c === 'below').length;
  const total = allRecords.length || 1;

  // Average per measurement type
  const typeAvgs = (['fasting', 'preMeal', 'postMeal', 'random'] as const).map(type => {
    const recs = allRecords.filter(r => r.measurementType === type);
    return {
      type,
      avg: recs.length ? recs.reduce((s, r) => s + r.glucose, 0) / recs.length : null,
      count: recs.length,
    };
  });

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const PERIODS: Period[] = ['7d', '30d', '3m'];
  const PERIOD_LABELS: Record<Period, string> = {
    '7d': t('statistics.period7d'),
    '30d': t('statistics.period30d'),
    '3m': t('statistics.period3m'),
  };
  const TYPE_FILTERS: { key: MeasurementType; label: string }[] = [
    { key: 'all', label: t('statistics.allTypes') },
    { key: 'fasting', label: t('glucose.fasting') },
    { key: 'preMeal', label: t('glucose.preMeal') },
    { key: 'postMeal', label: t('glucose.postMeal') },
    { key: 'random', label: t('glucose.random') },
  ];
  const TYPE_NAMES: Record<string, string> = {
    fasting: t('glucose.fasting'),
    preMeal: t('glucose.preMeal'),
    postMeal: t('glucose.postMeal'),
    random: t('glucose.random'),
  };

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      {/* Period selector */}
      <View className="flex-row gap-2 mb-3">
        {PERIODS.map(p => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full border ${
              period === p
                ? 'bg-rose-500 border-rose-500'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <Typography
              className={`text-xs font-outfit-bold ${
                period === p ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {PERIOD_LABELS[p]}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Measurement type filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {TYPE_FILTERS.map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setTypeFilter(f.key)}
            className={`px-3 py-1.5 rounded-full border ${
              typeFilter === f.key
                ? 'bg-rose-500 border-rose-500'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'
            }`}
          >
            <Typography
              className={`text-xs font-outfit-bold ${
                typeFilter === f.key ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {f.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chart */}
      <View className="mb-3">
        <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-3">
          {t('statistics.glucoseChart')}
        </Typography>
        <Card className="p-4 overflow-hidden">
          {hasData ? (
            <LineChart
              data={{
                labels,
                datasets: [{ data: points, strokeWidth: 2 }],
              }}
              width={CHART_WIDTH}
              height={180}
              withDots={points.length <= 20}
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundColor: bgColor,
                backgroundGradientFrom: bgColor,
                backgroundGradientTo: bgColor,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(244, 63, 94, ${opacity})`,
                labelColor: (opacity = 1) =>
                  isDark
                    ? `rgba(148, 163, 184, ${opacity})`
                    : `rgba(100, 116, 139, ${opacity})`,
                propsForLabels: { fontFamily: 'Outfit-Regular', fontSize: 9 },
                propsForDots: { r: '3', fill: '#F43F5E' },
              }}
              bezier
              style={{ marginLeft: -16 }}
            />
          ) : (
            <View className="items-center justify-center py-10">
              <Typography className="text-slate-400 font-outfit text-sm text-center">
                {t('statistics.noData')}
              </Typography>
            </View>
          )}
        </Card>
      </View>

      {/* Main stats */}
      <Card className="mb-3">
        <View className="flex-row divide-x divide-slate-100 dark:divide-slate-800">
          <View className="flex-1 items-center py-3">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.average')}
            </Typography>
            <Typography className="text-lg font-outfit-bold text-slate-800 dark:text-white">
              {avg ? `${avg.toFixed(0)} mg/dL` : '—'}
            </Typography>
          </View>
          <View className="flex-1 items-center py-3">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.minimum')}
            </Typography>
            <Typography className="text-lg font-outfit-bold text-slate-800 dark:text-white">
              {min ? `${min} mg/dL` : '—'}
            </Typography>
          </View>
          <View className="flex-1 items-center py-3">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.maximum')}
            </Typography>
            <Typography className="text-lg font-outfit-bold text-slate-800 dark:text-white">
              {max ? `${max} mg/dL` : '—'}
            </Typography>
          </View>
        </View>
      </Card>

      {/* Range distribution */}
      {allRecords.length > 0 && (
        <Card className="mb-3">
          <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-3">
            {t('statistics.inRange')} · {allRecords.length} {t('statistics.records').toLowerCase()}
          </Typography>
          <View className="flex-row gap-2 mb-3">
            <View className="flex-1 bg-emerald-50 dark:bg-emerald-950 rounded-2xl py-3 items-center">
              <Typography className="text-xs font-outfit text-emerald-600 dark:text-emerald-400 mb-0.5">
                {t('statistics.inRange')}
              </Typography>
              <Typography className="text-xl font-outfit-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((inRange / total) * 100)}%
              </Typography>
              <Typography className="text-xs font-outfit text-emerald-500">
                {inRange} {t('statistics.reg')}
              </Typography>
            </View>
            <View className="flex-1 bg-amber-50 dark:bg-amber-950 rounded-2xl py-3 items-center">
              <Typography className="text-xs font-outfit text-amber-600 dark:text-amber-400 mb-0.5">
                {t('statistics.aboveRange')}
              </Typography>
              <Typography className="text-xl font-outfit-bold text-amber-600 dark:text-amber-400">
                {Math.round((above / total) * 100)}%
              </Typography>
              <Typography className="text-xs font-outfit text-amber-500">
                {above} {t('statistics.reg')}
              </Typography>
            </View>
            <View className="flex-1 bg-blue-50 dark:bg-blue-950 rounded-2xl py-3 items-center">
              <Typography className="text-xs font-outfit text-blue-600 dark:text-blue-400 mb-0.5">
                {t('statistics.belowRange')}
              </Typography>
              <Typography className="text-xl font-outfit-bold text-blue-600 dark:text-blue-400">
                {Math.round((below / total) * 100)}%
              </Typography>
              <Typography className="text-xs font-outfit text-blue-500">
                {below} {t('statistics.reg')}
              </Typography>
            </View>
          </View>
          {/* Progress bar */}
          <View className="flex-row h-2 rounded-full overflow-hidden">
            <View
              className="bg-blue-400"
              style={{ flex: below }}
            />
            <View
              className="bg-emerald-500"
              style={{ flex: inRange }}
            />
            <View
              className="bg-amber-400"
              style={{ flex: above }}
            />
          </View>
        </Card>
      )}

      {/* Dia da semana */}
      <WeekdayDeviationSection
        records={filtered}
        getValue={r => r.glucose}
        getDate={r => r.date}
      />

      {/* Average per type */}
      {typeAvgs.some(t => t.count > 0) && (
        <Card className="mb-6">
          <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-3">
            {t('statistics.byType')}
          </Typography>
          {typeAvgs
            .filter(ta => ta.count > 0)
            .map(ta => (
              <View
                key={ta.type}
                className="flex-row items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800 last:border-0"
              >
                <Typography className="text-sm font-outfit text-slate-600 dark:text-slate-300">
                  {TYPE_NAMES[ta.type]}
                </Typography>
                <View className="flex-row items-center gap-2">
                  <Typography className="text-xs font-outfit text-slate-400">
                    {ta.count} {t('statistics.reg')}
                  </Typography>
                  <Typography className="text-sm font-outfit-bold text-rose-500">
                    {ta.avg!.toFixed(0)} mg/dL
                  </Typography>
                </View>
              </View>
            ))}
        </Card>
      )}

      <View className="h-6" />
    </ScrollView>
  );
};

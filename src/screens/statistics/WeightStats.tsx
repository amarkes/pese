import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { WeekdayDeviationSection } from '@/components/organisms/WeekdayDeviationSection';
import { WeightStorage, WeightRecord } from '@/services/WeightStorage';
import { SettingsStorage } from '@/services/SettingsStorage';

type Period = '7d' | '30d' | '3m';

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

interface StatBoxProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

const StatBox = ({ label, value, sub, color }: StatBoxProps) => (
  <View className="flex-1 items-center py-3">
    <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
      {label}
    </Typography>
    <Typography
      className={`text-lg font-outfit-bold ${color ?? 'text-slate-800 dark:text-white'}`}
    >
      {value}
    </Typography>
    {sub ? (
      <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mt-0.5">
        {sub}
      </Typography>
    ) : null}
  </View>
);

export const WeightStats = () => {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [period, setPeriod] = useState<Period>('30d');
  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [weightGoal, setWeightGoal] = useState(0);

  const fmt = useCallback(
    (d: Date) => d.toLocaleDateString(i18n.language, { day: '2-digit', month: '2-digit' }),
    [i18n.language]
  );

  // Fetch goal once on mount
  useEffect(() => {
    SettingsStorage.getSettings().then(s => {
      setWeightGoal(Number(s.weightGoal) || 0);
    });
  }, []);

  // Fetch records when period changes
  useEffect(() => {
    const load = async () => {
      const all = await WeightStorage.getRecords();
      const cutoff = getCutoff(period);
      const filtered = all
        .filter(r => new Date(r.date) >= cutoff)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setRecords(filtered);
    };
    load();
  }, [period]);

  const hasData = records.length >= 2;
  const avg = records.length
    ? records.reduce((s, r) => s + r.weight, 0) / records.length
    : 0;
  const min = records.length ? Math.min(...records.map(r => r.weight)) : 0;
  const max = records.length ? Math.max(...records.map(r => r.weight)) : 0;
  const delta =
    records.length >= 2
      ? records[records.length - 1].weight - records[0].weight
      : 0;
  const current = records.length ? records[records.length - 1].weight : 0;

  const labels = sparseLabels(records.map(r => fmt(new Date(r.date))));
  const points = records.map(r => r.weight);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const PERIODS: Period[] = ['7d', '30d', '3m'];
  const PERIOD_LABELS: Record<Period, string> = {
    '7d': t('statistics.period7d'),
    '30d': t('statistics.period30d'),
    '3m': t('statistics.period3m'),
  };

  const deltaColor =
    delta < -0.1
      ? 'text-emerald-500'
      : delta > 0.1
      ? 'text-rose-500'
      : 'text-slate-500';

  const DeltaIcon =
    delta < -0.1 ? TrendingDown : delta > 0.1 ? TrendingUp : Minus;
  const deltaIconColor =
    delta < -0.1 ? '#10B981' : delta > 0.1 ? '#F43F5E' : '#64748B';

  const goalDiff = weightGoal > 0 ? current - weightGoal : null;
  const goalProgress =
    weightGoal > 0 && records.length > 0
      ? Math.max(0, Math.min(1, 1 - Math.abs(goalDiff ?? 0) / Math.max(1, Math.abs(records[0].weight - weightGoal))))
      : 0;

  return (
    <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
      {/* Period selector */}
      <View className="flex-row gap-2 mb-4">
        {PERIODS.map(p => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full border ${
              period === p
                ? 'bg-indigo-500 border-indigo-500'
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

      {/* Chart */}
      <View className="mb-3">
        <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-3">
          {t('statistics.weightChart')}
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
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                labelColor: (opacity = 1) =>
                  isDark
                    ? `rgba(148, 163, 184, ${opacity})`
                    : `rgba(100, 116, 139, ${opacity})`,
                propsForLabels: { fontFamily: 'Outfit-Regular', fontSize: 9 },
                propsForDots: { r: '3', fill: '#6366F1' },
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

      {/* Stats grid */}
      <Card className="mb-3">
        <View className="flex-row divide-x divide-slate-100 dark:divide-slate-800">
          <StatBox label={t('statistics.average')} value={avg ? `${avg.toFixed(1)} kg` : '—'} />
          <StatBox label={t('statistics.minimum')} value={min ? `${min.toFixed(1)} kg` : '—'} />
          <StatBox label={t('statistics.maximum')} value={max ? `${max.toFixed(1)} kg` : '—'} />
        </View>
        <View className="border-t border-slate-100 dark:border-slate-800 flex-row">
          <View className="flex-1 items-center py-3">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.variation')}
            </Typography>
            <View className="flex-row items-center gap-1">
              <DeltaIcon size={14} color={deltaIconColor} />
              <Typography className={`text-lg font-outfit-bold ${deltaColor}`}>
                {records.length >= 2 ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} kg` : '—'}
              </Typography>
            </View>
          </View>
          <View className="flex-1 items-center py-3 border-l border-slate-100 dark:border-slate-800">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.records')}
            </Typography>
            <Typography className="text-lg font-outfit-bold text-slate-800 dark:text-white">
              {records.length}
            </Typography>
          </View>
          {weightGoal > 0 && (
            <View className="flex-1 items-center py-3 border-l border-slate-100 dark:border-slate-800">
              <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
                {t('statistics.goal')}
              </Typography>
              <Typography className="text-lg font-outfit-bold text-slate-800 dark:text-white">
                {`${weightGoal.toFixed(1)} kg`}
              </Typography>
            </View>
          )}
        </View>
      </Card>

      {/* Goal progress */}
      {weightGoal > 0 && current > 0 && (
        <Card className="mb-6">
          <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-3">
            {t('statistics.weightGoalProgress')}
          </Typography>
          <View className="flex-row items-center justify-between mb-2">
            <Typography className="text-sm font-outfit text-slate-600 dark:text-slate-400">
              {`${current.toFixed(1)} kg`}
            </Typography>
            <Typography className="text-sm font-outfit text-slate-400 dark:text-slate-500">
              {goalDiff !== null
                ? `${Math.abs(goalDiff).toFixed(1)} kg ${t('statistics.toGoal')}`
                : ''}
            </Typography>
            <Typography className="text-sm font-outfit-bold text-indigo-500">
              {`${weightGoal.toFixed(1)} kg`}
            </Typography>
          </View>
          <View className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <View
              className="h-2 bg-indigo-500 rounded-full"
              style={{ width: `${Math.round(goalProgress * 100)}%` }}
            />
          </View>
        </Card>
      )}

      {/* Dia da semana */}
      <WeekdayDeviationSection
        records={records}
        getValue={r => r.weight}
        getDate={r => r.date}
        colorPositive="#F43F5E"
        colorNegative="#10B981"
      />

      <View className="h-6" />
    </ScrollView>
  );
};

import React, { useState, useEffect } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { WeekdayDeviationSection } from '@/components/organisms/WeekdayDeviationSection';
import { WaterStorage, WaterRecord } from '@/services/WaterStorage';
import { SettingsStorage } from '@/services/SettingsStorage';

type Period = '7d' | '30d' | '3m';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH = SCREEN_WIDTH - 48;

function getCutoff(period: Period): Date {
  const d = new Date();
  if (period === '7d') d.setDate(d.getDate() - 7);
  else if (period === '30d') d.setDate(d.getDate() - 30);
  else d.setMonth(d.getMonth() - 3);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function fmtShort(d: Date, lang: string): string {
  return d.toLocaleDateString(lang, { day: '2-digit', month: '2-digit' });
}

interface DayData {
  label: string;
  amount: number;
  date: Date;
}

function buildDayData(records: WaterRecord[], cutoff: Date, lang: string): DayData[] {
  const dayMap = new Map<string, number>();
  for (const r of records) {
    const d = new Date(r.date);
    const k = dateKey(d);
    dayMap.set(k, (dayMap.get(k) ?? 0) + r.amount);
  }

  const result: DayData[] = [];
  const cur = new Date(cutoff);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  while (cur <= end) {
    const k = dateKey(cur);
    if (dayMap.has(k)) {
      result.push({
        label: fmtShort(new Date(cur), lang),
        amount: dayMap.get(k)!,
        date: new Date(cur),
      });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

function buildWeekData(records: WaterRecord[], cutoff: Date, lang: string): DayData[] {
  const weekMap = new Map<number, { amount: number; label: string; date: Date }>();
  for (const r of records) {
    const d = new Date(r.date);
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - d.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const k = startOfWeek.getTime();
    if (!weekMap.has(k)) {
      weekMap.set(k, { amount: 0, label: fmtShort(startOfWeek, lang), date: startOfWeek });
    }
    weekMap.get(k)!.amount += r.amount;
  }
  return [...weekMap.values()]
    .filter(w => w.date >= cutoff)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(w => ({ label: w.label, amount: Math.round(w.amount / 7), date: w.date }));
}

export const WaterStats = () => {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [period, setPeriod] = useState<Period>('7d');
  const [allRecords, setAllRecords] = useState<WaterRecord[]>([]);
  const [waterGoal, setWaterGoal] = useState(2000);

  // Fetch goal once on mount
  useEffect(() => {
    SettingsStorage.getSettings().then(s => {
      setWaterGoal(Number(s.waterGoal) || 2000);
    });
  }, []);

  // Fetch records when period changes
  useEffect(() => {
    WaterStorage.getRecords().then(all => {
      const cutoff = getCutoff(period);
      setAllRecords(all.filter(r => new Date(r.date) >= cutoff));
    });
  }, [period]);

  const cutoff = getCutoff(period);
  const dayData =
    period === '3m'
      ? buildWeekData(allRecords, cutoff, i18n.language)
      : buildDayData(allRecords, cutoff, i18n.language);

  const hasData = dayData.length >= 1;
  const amounts = dayData.map(d => d.amount);
  const totalDays =
    period === '7d' ? 7 : period === '30d' ? 30 : 13;

  const dailyAvg = amounts.length
    ? amounts.reduce((a, b) => a + b, 0) / amounts.length
    : 0;
  const bestDay = amounts.length ? Math.max(...amounts) : 0;
  const goalMetDays = amounts.filter(a => a >= waterGoal).length;

  // Limit bars for readability
  const MAX_BARS = 14;
  const visibleData =
    dayData.length > MAX_BARS ? dayData.slice(dayData.length - MAX_BARS) : dayData;
  const barLabels = visibleData.map(d => d.label);
  const barAmounts = visibleData.map(d => d.amount);

  const bgColor = isDark ? '#0F172A' : '#FFFFFF';
  const barColor = (opacity = 1) => `rgba(14, 165, 233, ${opacity})`;

  const PERIODS: Period[] = ['7d', '30d', '3m'];
  const PERIOD_LABELS: Record<Period, string> = {
    '7d': t('statistics.period7d'),
    '30d': t('statistics.period30d'),
    '3m': t('statistics.period3m'),
  };

  const goalPct = waterGoal > 0 ? Math.min(1, dailyAvg / waterGoal) : 0;
  const goalColor =
    goalPct >= 1
      ? 'text-emerald-500'
      : goalPct >= 0.7
      ? 'text-amber-500'
      : 'text-rose-500';
  const barFillColor =
    goalPct >= 1
      ? '#10B981'
      : goalPct >= 0.7
      ? '#F59E0B'
      : '#0EA5E9';
  const barFill = (opacity = 1) =>
    `rgba(${
      goalPct >= 1
        ? '16, 185, 129'
        : goalPct >= 0.7
        ? '245, 158, 11'
        : '14, 165, 233'
    }, ${opacity})`;

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
                ? 'bg-sky-500 border-sky-500'
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
          {t('statistics.waterChart')}
          {period === '3m' ? ` ${t('statistics.weeklyAvg')}` : ''}
        </Typography>
        <Card className="p-4 overflow-hidden">
          {hasData ? (
            <BarChart
              data={{
                labels: barLabels,
                datasets: [{ data: barAmounts }],
              }}
              width={CHART_WIDTH}
              height={180}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: bgColor,
                backgroundGradientFrom: bgColor,
                backgroundGradientTo: bgColor,
                decimalPlaces: 0,
                color: barFill,
                labelColor: (opacity = 1) =>
                  isDark
                    ? `rgba(148, 163, 184, ${opacity})`
                    : `rgba(100, 116, 139, ${opacity})`,
                propsForLabels: { fontFamily: 'Outfit-Regular', fontSize: 9 },
                barPercentage: barAmounts.length <= 7 ? 0.6 : 0.4,
              }}
              style={{ marginLeft: -16 }}
              showValuesOnTopOfBars={false}
              withInnerLines={false}
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

      {/* Goal progress bar */}
      {waterGoal > 0 && (
        <Card className="mb-3">
          <View className="flex-row items-center justify-between mb-2">
            <Typography className="text-xs font-outfit-bold text-slate-400 uppercase">
              {t('statistics.goal')}: {waterGoal} ml
            </Typography>
            <Typography className={`text-sm font-outfit-bold ${goalColor}`}>
              {Math.round(goalPct * 100)}%
            </Typography>
          </View>
          <View className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <View
              className="h-2 rounded-full"
              style={{
                width: `${Math.round(goalPct * 100)}%`,
                backgroundColor: barFillColor,
              }}
            />
          </View>
          <Typography className="text-xs font-outfit text-slate-400 mt-2">
            {t('statistics.dailyAvg')}: {Math.round(dailyAvg)} ml
          </Typography>
        </Card>
      )}

      {/* Stats grid */}
      <Card className="mb-3">
        <View className="flex-row divide-x divide-slate-100 dark:divide-slate-800">
          <View className="flex-1 items-center py-3">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.dailyAvg')}
            </Typography>
            <Typography className="text-lg font-outfit-bold text-slate-800 dark:text-white">
              {dailyAvg ? `${Math.round(dailyAvg)} ml` : '—'}
            </Typography>
          </View>
          <View className="flex-1 items-center py-3">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.bestDay')}
            </Typography>
            <Typography className="text-lg font-outfit-bold text-sky-500">
              {bestDay ? `${bestDay} ml` : '—'}
            </Typography>
          </View>
          <View className="flex-1 items-center py-3">
            <Typography className="text-xs font-outfit text-slate-400 dark:text-slate-500 mb-1">
              {t('statistics.goalMetDays')}
            </Typography>
            <Typography className="text-lg font-outfit-bold text-emerald-500">
              {amounts.length
                ? `${goalMetDays}/${amounts.length}`
                : '—'}
            </Typography>
          </View>
        </View>
      </Card>

      {/* Dia da semana — usa sumByDay pois água é métrica acumulativa */}
      <WeekdayDeviationSection
        records={allRecords}
        getValue={r => r.amount}
        getDate={r => r.date}
        aggregation="sumByDay"
        colorPositive="#10B981"
        colorNegative="#F59E0B"
      />

      {/* Daily breakdown for 7d */}
      {period === '7d' && dayData.length > 0 && (
        <Card className="mb-6">
          <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-3">
            {t('statistics.periodDetails')}
          </Typography>
          {dayData.map((d, i) => {
            const pct = Math.min(1, d.amount / waterGoal);
            const metGoal = d.amount >= waterGoal;
            return (
              <View
                key={i}
                className="flex-row items-center py-2 border-b border-slate-50 dark:border-slate-800 last:border-0"
              >
                <Typography className="text-sm font-outfit text-slate-500 dark:text-slate-400 w-16">
                  {d.label}
                </Typography>
                <View className="flex-1 mx-3 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <View
                    className={`h-1.5 rounded-full ${metGoal ? 'bg-emerald-500' : 'bg-sky-400'}`}
                    style={{ width: `${Math.round(pct * 100)}%` }}
                  />
                </View>
                <Typography
                  className={`text-sm font-outfit-bold w-16 text-right ${
                    metGoal ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {d.amount} ml
                </Typography>
              </View>
            );
          })}
        </Card>
      )}

      <View className="h-6" />
    </ScrollView>
  );
};

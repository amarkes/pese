import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColorScheme } from 'nativewind';
import { BarChart2 } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { useTranslation } from 'react-i18next';
import { WeightRecord } from '@/services/WeightStorage';
import { GlucoseRecord } from '@/services/GlucoseStorage';
import { WaterRecord } from '@/services/WaterStorage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_LABELS = 6;

type ChartTab = 'weight' | 'glucose' | 'water';

const COLORS: Record<ChartTab, { rgb: string; hex: string }> = {
  weight:  { rgb: '99, 102, 241',  hex: '#6366F1' },
  glucose: { rgb: '244, 63, 94',   hex: '#F43F5E' },
  water:   { rgb: '14, 165, 233',  hex: '#0EA5E9' },
};

interface Props {
  weights: WeightRecord[];
  glucoses: GlucoseRecord[];
  waters: WaterRecord[];
  dataIncluded: { weight: boolean; glucose: boolean; water: boolean };
  dateRange: { past: Date; now: Date };
  language: string;
}

function fmt(d: Date, lang: string) {
  return d.toLocaleDateString(lang, { day: '2-digit', month: '2-digit' });
}

function sparseLabels(labels: string[]): string[] {
  if (labels.length <= MAX_LABELS) return labels;
  const step = Math.ceil((labels.length - 1) / (MAX_LABELS - 1));
  return labels.map((l, i) =>
    i === 0 || i === labels.length - 1 || i % step === 0 ? l : ''
  );
}

export const TrendChart = ({ weights, glucoses, waters, dataIncluded, dateRange, language }: Props) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const availableTabs = (['weight', 'glucose', 'water'] as ChartTab[]).filter(
    tab => dataIncluded[tab]
  );

  const [activeTab, setActiveTab] = useState<ChartTab>('weight');
  const currentTab = availableTabs.includes(activeTab)
    ? activeTab
    : availableTabs[0] ?? 'weight';

  const chartData = useMemo(() => {
    if (currentTab === 'weight') {
      const sorted = [...weights].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return {
        points: sorted.map(r => r.weight),
        dates: sorted.map(r => fmt(new Date(r.date), language)),
        unit: 'kg',
        decimalPlaces: 1,
      };
    }

    if (currentTab === 'glucose') {
      const sorted = [...glucoses].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return {
        points: sorted.map(r => r.glucose),
        dates: sorted.map(r => fmt(new Date(r.date), language)),
        unit: 'mg/dL',
        decimalPlaces: 0,
      };
    }

    // water: aggregate by day
    const dayMap = new Map<string, number>();
    for (const r of waters) {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      dayMap.set(key, (dayMap.get(key) ?? 0) + r.amount);
    }
    const result: { label: string; value: number }[] = [];
    const cur = new Date(dateRange.past);
    cur.setHours(0, 0, 0, 0);
    const end = new Date(dateRange.now);
    end.setHours(23, 59, 59, 999);
    while (cur <= end) {
      const key = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
      if (dayMap.has(key)) {
        result.push({ label: fmt(new Date(cur), language), value: dayMap.get(key)! });
      }
      cur.setDate(cur.getDate() + 1);
    }
    return {
      points: result.map(r => r.value),
      dates: result.map(r => r.label),
      unit: 'ml',
      decimalPlaces: 0,
    };
  }, [currentTab, weights, glucoses, waters, dateRange, language]);

  if (availableTabs.length === 0) return null;

  const hasData = chartData.points.length >= 2;
  const labels = sparseLabels(chartData.dates);
  const color = COLORS[currentTab];
  const bgColor = isDark ? '#0F172A' : '#FFFFFF';

  const TAB_LABELS: Record<ChartTab, string> = {
    weight:  t('reports.weightLabel'),
    glucose: t('reports.glucoseLabel'),
    water:   t('reports.waterLabel'),
  };

  const ACTIVE_BG: Record<ChartTab, string> = {
    weight:  'bg-indigo-500',
    glucose: 'bg-rose-500',
    water:   'bg-sky-500',
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <BarChart2 size={18} color="#64748B" />
        <Typography className="ml-2 font-outfit-bold text-slate-500 uppercase text-xs">
          {t('reports.chartTitle')}
        </Typography>
      </View>

      {availableTabs.length > 1 && (
        <View className="flex-row mb-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {availableTabs.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg items-center ${currentTab === tab ? ACTIVE_BG[tab] : ''}`}
            >
              <Typography
                className={`text-xs font-outfit-bold ${
                  currentTab === tab ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {TAB_LABELS[tab]}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Card className="p-4">
        {hasData ? (
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data: chartData.points,
                  color: (opacity = 1) => `rgba(${color.rgb}, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={SCREEN_WIDTH - 64}
            height={180}
            withDots={chartData.points.length <= 20}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels
            withHorizontalLabels
            chartConfig={{
              backgroundColor: bgColor,
              backgroundGradientFrom: bgColor,
              backgroundGradientTo: bgColor,
              decimalPlaces: chartData.decimalPlaces,
              color: (opacity = 1) => `rgba(${color.rgb}, ${opacity})`,
              labelColor: (opacity = 1) =>
                isDark
                  ? `rgba(148, 163, 184, ${opacity})`
                  : `rgba(100, 116, 139, ${opacity})`,
              propsForLabels: { fontFamily: 'Outfit-Regular', fontSize: 9 },
              propsForDots: { r: '3', fill: color.hex },
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <View className="items-center justify-center py-10">
            <Typography className="text-slate-400 font-outfit text-sm">
              {t('history.noData')}
            </Typography>
          </View>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 4,
    marginLeft: -16,
  },
});

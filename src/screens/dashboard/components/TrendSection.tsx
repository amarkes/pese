import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { Activity } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';

import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { IconBox } from '@/components/atoms/IconBox';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TrendSectionProps {
  labels: string[];
  data: number[];
  currentWeight: string;
  changeLabel: string | null;
  changeTone: 'positive' | 'negative' | 'neutral';
  hasData: boolean;
}

export const TrendSection: React.FC<TrendSectionProps> = ({
  labels,
  data,
  currentWeight,
  changeLabel,
  changeTone,
  hasData,
}) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const changeStyles = {
    positive: 'text-red-500',
    negative: 'text-emerald-500',
    neutral: 'text-slate-500 dark:text-slate-400',
  } as const;

  return (
    <Card className="mb-8 p-6">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Typography variant="label" className="mb-1">{t('dashboard.trend7days')}</Typography>
          <View className="flex-row items-center">
            <Typography variant="h2" className="text-3xl font-outfit-bold mr-3">{currentWeight} kg</Typography>
            {changeLabel ? (
              <Typography variant="caption" className={`${changeStyles[changeTone]} font-outfit-bold`}>
                {changeLabel}
              </Typography>
            ) : null}
          </View>
        </View>
        <IconBox icon={Activity} color="#6C6C70" bgColor="bg-slate-50" size={20} className="w-10 h-10" />
      </View>

      {hasData ? (
        <LineChart
          data={{
            labels,
            datasets: [{ data, color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, strokeWidth: 4 }]
          }}
          width={SCREEN_WIDTH - 80}
          height={160}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={false}
          chartConfig={{
            backgroundColor: isDarkMode ? '#1C1C1E' : '#fff',
            backgroundGradientFrom: isDarkMode ? '#1C1C1E' : '#fff',
            backgroundGradientTo: isDarkMode ? '#1C1C1E' : '#fff',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            labelColor: (opacity = 1) => isDarkMode ? `rgba(142, 142, 147, ${opacity})` : `rgba(108, 108, 112, ${opacity})`,
            propsForLabels: { fontFamily: 'Inter_18pt-Medium', fontSize: 10 },
            style: { borderRadius: 16 }
          }}
          bezier
          style={styles.chart}
        />
      ) : (
        <View className="items-center justify-center py-10">
          <Typography variant="caption">{t('history.noData')}</Typography>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    marginLeft: -20,
  },
});

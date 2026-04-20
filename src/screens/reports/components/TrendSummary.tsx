import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { Activity, TrendingUp, TrendingDown, Minus, Droplets } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface TrendSummaryProps {
  stats: {
    weightDelta: number;
    glucoseDelta: number;
    waterAvg: number;
    waterGoal: number;
  };
  dataIncluded: { weight: boolean; glucose: boolean; water: boolean };
}

export const TrendSummary = ({ stats, dataIncluded }: TrendSummaryProps) => {
  const { t } = useTranslation();

  const weightPositive = stats.weightDelta > 0.05;
  const weightNegative = stats.weightDelta < -0.05;
  const glucoseUp = stats.glucoseDelta > 1;
  const glucoseDown = stats.glucoseDelta < -1;

  const waterPct = Math.min(100, (stats.waterAvg / (stats.waterGoal || 2000)) * 100);

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-3">
        <Activity size={18} color="#64748B" />
        <Typography className="ml-2 font-outfit-bold text-slate-500 uppercase text-xs">
          {t('reports.trendTitle')}
        </Typography>
      </View>

      {dataIncluded.weight && (
        <Card className="flex-row items-center justify-between mb-3 p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 items-center justify-center mr-4">
              {weightPositive ? (
                <TrendingUp size={20} color="#6366F1" />
              ) : weightNegative ? (
                <TrendingDown size={20} color="#6366F1" />
              ) : (
                <Minus size={20} color="#6366F1" />
              )}
            </View>
            <View>
              <Typography className="text-xs text-slate-500 font-outfit">
                {t('reports.weightDeltaLabel')}
              </Typography>
              <Typography className="font-outfit-bold text-xl text-slate-900 dark:text-white">
                {stats.weightDelta > 0 ? '+' : ''}{stats.weightDelta.toFixed(1)} kg
              </Typography>
            </View>
          </View>
          <View className="items-end">
            <Typography className="text-[10px] text-slate-400 font-outfit-bold uppercase">
              {t('reports.variation')}
            </Typography>
            <Typography
              className={`text-xs font-outfit-bold ${
                weightPositive ? 'text-orange-500' : weightNegative ? 'text-green-500' : 'text-slate-400'
              }`}
            >
              {weightPositive
                ? t('reports.gained')
                : weightNegative
                ? t('reports.lost')
                : t('reports.stable')}
            </Typography>
          </View>
        </Card>
      )}

      {dataIncluded.glucose && (
        <Card className="flex-row items-center justify-between mb-3 p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-900/30 items-center justify-center mr-4">
              {glucoseUp ? (
                <TrendingUp size={20} color="#F43F5E" />
              ) : glucoseDown ? (
                <TrendingDown size={20} color="#F43F5E" />
              ) : (
                <Minus size={20} color="#F43F5E" />
              )}
            </View>
            <View>
              <Typography className="text-xs text-slate-500 font-outfit">
                {t('reports.glucoseTrendLabel')}
              </Typography>
              <Typography className="font-outfit-bold text-xl text-slate-900 dark:text-white">
                {stats.glucoseDelta > 0 ? '+' : ''}{stats.glucoseDelta.toFixed(0)} mg/dL
              </Typography>
            </View>
          </View>
          <View className="items-end">
            <Typography className="text-[10px] text-slate-400 font-outfit-bold uppercase">
              {t('reports.trend')}
            </Typography>
            <Typography
              className={`text-xs font-outfit-bold ${
                glucoseUp ? 'text-red-500' : glucoseDown ? 'text-green-500' : 'text-slate-400'
              }`}
            >
              {glucoseUp
                ? t('reports.rising')
                : glucoseDown
                ? t('reports.falling')
                : t('reports.stable')}
            </Typography>
          </View>
        </Card>
      )}

      {dataIncluded.water && (
        <Card className="flex-row items-center justify-between mb-3 p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-900/30 items-center justify-center mr-4">
              <Droplets size={20} color="#0EA5E9" />
            </View>
            <View>
              <Typography className="text-xs text-slate-500 font-outfit">
                {t('reports.waterDailyLabel')}
              </Typography>
              <Typography className="font-outfit-bold text-xl text-slate-900 dark:text-white">
                {stats.waterAvg.toFixed(0)} ml
              </Typography>
            </View>
          </View>
          <View className="items-end">
            <Typography className="text-[10px] text-slate-400 font-outfit-bold uppercase">
              {t('reports.dailyAvg')}
            </Typography>
            <Typography
              className={`text-xs font-outfit-bold ${
                waterPct >= 100 ? 'text-green-500' : waterPct >= 60 ? 'text-blue-500' : 'text-orange-500'
              }`}
            >
              {waterPct.toFixed(0)}% {t('reports.ofGoal')}
            </Typography>
          </View>
        </Card>
      )}
    </View>
  );
};

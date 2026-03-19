import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { FileText, TrendingUp, Droplet, Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface ReportSummaryProps {
  dataIncluded: { weight: boolean; glucose: boolean; water: boolean };
  stats: {
    weightAvg: number;
    weightGoal: number;
    glucoseAvg: number;
    waterAvg: number;
    waterGoal: number;
  };
}

export const ReportSummary = ({ dataIncluded, stats }: ReportSummaryProps) => {
  const { t } = useTranslation();

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-3">
        <FileText size={18} color="#64748B" />
        <Typography className="ml-2 font-outfit-bold text-slate-500 uppercase text-xs">
          {t('reports.summaryTitle')}
        </Typography>
      </View>

      {dataIncluded.weight && (
        <Card className="flex-row items-center justify-between mb-3 p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 items-center justify-center mr-4">
              <TrendingUp size={20} color="#3B82F6" />
            </View>
            <View>
              <Typography className="text-xs text-slate-500 font-outfit">{t('reports.weightAvg')}</Typography>
              <Typography className="font-outfit-bold text-xl text-slate-900 dark:text-white">
                {stats.weightAvg.toFixed(1)} kg
              </Typography>
            </View>
          </View>
          <View className="items-end">
            <Typography className="text-[10px] text-slate-400 font-outfit-bold uppercase">
              {t('reports.weightGoal', { goal: stats.weightGoal })}
            </Typography>
            <Typography className="text-xs text-red-500 font-outfit-bold">
              {stats.weightAvg > stats.weightGoal ? '+' : ''}{(stats.weightAvg - stats.weightGoal).toFixed(1)}kg
            </Typography>
          </View>
        </Card>
      )}

      {dataIncluded.glucose && (
        <Card className="flex-row items-center justify-between mb-3 p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/30 items-center justify-center mr-4">
              <Droplet size={20} color="#EF4444" />
            </View>
            <View>
              <Typography className="text-xs text-slate-500 font-outfit">{t('reports.glucoseAvg')}</Typography>
              <Typography className="font-outfit-bold text-xl text-slate-900 dark:text-white">
                {stats.glucoseAvg.toFixed(0)} mg/dL
              </Typography>
            </View>
          </View>
          <View className="items-end">
            <Typography className="text-[10px] text-slate-400 font-outfit-bold uppercase">
              {t('reports.onTarget')}
            </Typography>
            <Typography className="text-xs text-green-500 font-outfit-bold flex-row items-center">
              <Check size={12} color="#22C55E" /> 88%
            </Typography>
          </View>
        </Card>
      )}

      {dataIncluded.water && (
        <Card className="flex-row items-center justify-between mb-3 p-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full bg-cyan-50 dark:bg-cyan-900/30 items-center justify-center mr-4">
              <Droplet size={20} color="#0EA5E9" />
            </View>
            <View>
              <Typography className="text-xs text-slate-500 font-outfit">{t('reports.waterAvg')}</Typography>
              <Typography className="font-outfit-bold text-xl text-slate-900 dark:text-white">
                {stats.waterAvg.toFixed(0)} ml
              </Typography>
            </View>
          </View>
          <View className="items-end">
            <Typography className="text-[10px] text-slate-400 font-outfit-bold uppercase">
              {t('reports.dailyGoal')}
            </Typography>
            <Typography className="text-xs text-blue-500 font-outfit-bold flex-row items-center">
              <Check size={12} color="#3B82F6" /> {Math.min(100, (stats.waterAvg / (stats.waterGoal || 1)) * 100).toFixed(0)}%
            </Typography>
          </View>
        </Card>
      )}
    </View>
  );
};

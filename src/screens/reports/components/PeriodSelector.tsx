import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { Calendar } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface PeriodSelectorProps {
  period: number;
  setPeriod: (period: number) => void;
}

export const PeriodSelector = ({ period, setPeriod }: PeriodSelectorProps) => {
  const { t } = useTranslation();

  const renderPeriodOption = (label: string, value: number) => {
    const isSelected = period === value;
    return (
      <TouchableOpacity 
        onPress={() => setPeriod(value)}
        className={`flex-1 items-center justify-center py-3 rounded-xl border-2 ${isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'} mb-2`}
      >
        <Typography className={`font-outfit-medium ${isSelected ? 'text-blue-500' : 'text-slate-600 dark:text-slate-400'}`}>
          {label}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <Calendar size={18} color="#64748B" />
        <Typography className="ml-2 font-outfit-bold text-slate-500 uppercase text-xs">
          {t('reports.periodTitle')}
        </Typography>
      </View>
      {renderPeriodOption(t('reports.last30days'), 30)}
      {renderPeriodOption(t('reports.thisMonth'), new Date().getDate())}
      {renderPeriodOption(t('reports.custom'), 90)}
    </View>
  );
};

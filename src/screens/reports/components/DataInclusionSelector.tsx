import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { CheckCircle2, Circle, Droplet, TrendingUp, CheckSquare } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface DataInclusionSelectorProps {
  dataIncluded: { weight: boolean; glucose: boolean; water: boolean };
  toggleInclude: (key: keyof DataInclusionSelectorProps['dataIncluded']) => void;
}

export const DataInclusionSelector = ({ dataIncluded, toggleInclude }: DataInclusionSelectorProps) => {
  const { t } = useTranslation();

  const renderDataOption = (key: keyof typeof dataIncluded, label: string, sub: string, icon: any, color: string) => {
    const isSelected = dataIncluded[key];
    const IconComponent = icon;
    return (
      <TouchableOpacity 
        onPress={() => toggleInclude(key)}
        className="flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mb-2 mr-2 flex-1 min-w-[140px]"
      >
        <View className="flex-row justify-between w-full mb-2">
          <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: `${color}20` }}>
            <IconComponent size={16} color={color} />
          </View>
          {isSelected ? (
            <CheckCircle2 size={20} color="#3B82F6" />
          ) : (
            <Circle size={20} color="#CBD5E1" />
          )}
        </View>
        <Typography className="font-outfit-bold text-slate-900 dark:text-white mb-1">
          {label}
        </Typography>
        <Typography className="text-xs text-slate-500 dark:text-slate-400 font-outfit">
          {sub}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        <CheckSquare size={18} color="#64748B" />
        <Typography className="ml-2 font-outfit-bold text-slate-500 uppercase text-xs">
          {t('reports.dataIncluded')}
        </Typography>
      </View>
      
      <View className="flex-row flex-wrap">
        {renderDataOption('weight', t('reports.weightLabel'), t('reports.weightSub'), TrendingUp, '#3B82F6')}
        {renderDataOption('glucose', t('reports.glucoseLabel'), t('reports.glucoseSub'), Droplet, '#EF4444')}
        {renderDataOption('water', t('reports.waterLabel'), t('reports.waterSub'), Droplet, '#0EA5E9')}
      </View>
    </View>
  );
};

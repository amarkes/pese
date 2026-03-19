import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Weight, Droplets, Activity, Zap } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { IconBox } from '@/components/atoms/IconBox';

export const SummarySection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <View className="flex-row items-end justify-between mb-6">
        <Typography variant="h2" className="text-2xl font-outfit-medium">
          {t('dashboard.todaySummary')}
        </Typography>
        <TouchableOpacity>
          <Typography variant="caption" className="text-primary font-outfit-medium">
            {t('common.viewDetails')}
          </Typography>
        </TouchableOpacity>
      </View>

      <Card className="mb-6 p-6">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <IconBox icon={Weight} color="#007AFF" bgColor="bg-blue-50" size={24} className="mr-4 w-12 h-12" />
            <View>
              <Typography variant="label" className="text-xs uppercase font-outfit-bold">
                {t('dashboard.lastWeight')}
              </Typography>
              <View className="flex-row items-baseline">
                <Typography variant="h1" className="text-4xl font-outfit-bold mr-2 text-text dark:text-text-dark">
                  75.5
                </Typography>
                <Typography variant="h3" className="text-2xl font-outfit-semibold text-text-secondary dark:text-text-secondary-dark">
                  kg
                </Typography>
              </View>
            </View>
          </View>
          <View className="bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-2xl flex-row items-center">
            <Zap size={14} color="#10B981" />
            <Typography variant="caption" className="text-emerald-500 font-outfit-bold ml-1">
              -0.2
            </Typography>
          </View>
        </View>
      </Card>

      <View className="flex-row gap-4 mb-6">
        <View className="flex-1">
          <Card className="p-5 h-44 justify-between">
            <IconBox icon={Activity} color="#F97316" bgColor="bg-orange-50" size={20} className="w-12 h-12" />
            <View className="mt-4">
              <Typography variant="label" className="mb-1">{t('common.glucose')}</Typography>
              <View className="flex-row items-baseline">
                <Typography variant="h2" className="text-2xl font-outfit-bold mr-1">92</Typography>
                <Typography variant="caption" className="text-xs font-outfit-medium">mg/dL</Typography>
              </View>
              <Typography variant="caption" className="text-[10px] text-text-secondary mt-1">
                {t('dashboard.targetRange', { min: 70, max: 100 })}
              </Typography>
            </View>
          </Card>
        </View>
        <View className="flex-1">
          <Card className="p-5 h-44 justify-between">
            <IconBox icon={Droplets} color="#3B82F6" bgColor="bg-blue-50" size={20} className="w-12 h-12" />
            <View className="mt-4">
              <Typography variant="label" className="mb-1">{t('common.water')}</Typography>
              <View className="flex-row items-baseline">
                <Typography variant="h2" className="text-2xl font-outfit-bold mr-1">1200</Typography>
                <Typography variant="caption" className="text-xs font-outfit-medium text-text-secondary dark:text-text-secondary-dark">/ 2500 ml</Typography>
              </View>
              <View className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <View className="h-full bg-blue-500 rounded-full w-[48%]" />
              </View>
            </View>
          </Card>
        </View>
      </View>
    </>
  );
};

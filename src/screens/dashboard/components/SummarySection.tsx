import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Weight, Droplets, Activity, Zap, Heart } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { IconBox } from '@/components/atoms/IconBox';
import { useNavigation } from '@react-navigation/native';

const BP_CAT_COLORS: Record<string, { text: string; bg: string; hex: string }> = {
  low:      { text: 'text-blue-500',    bg: 'bg-blue-50 dark:bg-blue-950/30',    hex: '#3B82F6' },
  normal:   { text: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', hex: '#10B981' },
  elevated: { text: 'text-lime-500',    bg: 'bg-lime-50 dark:bg-lime-950/30',    hex: '#84CC16' },
  hyp1:     { text: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-950/30',  hex: '#F59E0B' },
  hyp2:     { text: 'text-orange-500',  bg: 'bg-orange-50 dark:bg-orange-950/30',hex: '#F97316' },
  crisis:   { text: 'text-red-500',     bg: 'bg-red-50 dark:bg-red-950/30',      hex: '#EF4444' },
};

interface SummarySectionProps {
  lastWeight: string;
  weightDiff: string | null;
  weightDiffTone: 'positive' | 'negative' | 'neutral';
  glucoseValue: string;
  glucoseTargetMin: number;
  glucoseTargetMax: number;
  waterConsumed: number;
  waterGoal: number;
  waterProgress: number;
  bpSystolic: number | null;
  bpDiastolic: number | null;
  bpCategory: string | null;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  lastWeight,
  weightDiff,
  weightDiffTone,
  glucoseValue,
  glucoseTargetMin,
  glucoseTargetMax,
  waterConsumed,
  waterGoal,
  waterProgress,
  bpSystolic,
  bpDiastolic,
  bpCategory,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const bpStyle = bpCategory ? (BP_CAT_COLORS[bpCategory] ?? BP_CAT_COLORS.normal) : null;


  const weightDiffStyles = {
    positive: {
      container: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-500',
      icon: '#EF4444',
    },
    negative: {
      container: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-500',
      icon: '#10B981',
    },
    neutral: {
      container: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-500',
      icon: '#64748B',
    },
  } as const;
  const currentWeightDiffStyle = weightDiffStyles[weightDiffTone];

  return (
    <>
      <View className="flex-row items-end justify-between mb-6">
        <Typography variant="h2" className="text-2xl font-outfit-medium">
          {t('dashboard.todaySummary')}
        </Typography>
        <TouchableOpacity
          onPress={() => navigation.navigate('History')}
        >
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
                  {lastWeight}
                </Typography>
                <Typography variant="h3" className="text-2xl font-outfit-semibold text-text-secondary dark:text-text-secondary-dark">
                  kg
                </Typography>
              </View>
            </View>
          </View>
          {weightDiff ? (
            <View className={`${currentWeightDiffStyle.container} px-3 py-1.5 rounded-2xl flex-row items-center`}>
              <Zap size={14} color={currentWeightDiffStyle.icon} />
              <Typography variant="caption" className={`${currentWeightDiffStyle.text} font-outfit-bold ml-1`}>
                {weightDiff}
              </Typography>
            </View>
          ) : null}
        </View>
      </Card>

      <View className="flex-row gap-4 mb-6">
        <View className="flex-1">
          <Card className="p-5 h-44 justify-between">
            <IconBox icon={Activity} color="#F97316" bgColor="bg-orange-50" size={20} className="w-12 h-12" />
            <View className="mt-4">
              <Typography variant="label" className="mb-1">{t('common.glucose')}</Typography>
              <View className="flex-row items-baseline">
                <Typography variant="h2" className="text-2xl font-outfit-bold mr-1">{glucoseValue}</Typography>
                <Typography variant="caption" className="text-xs font-outfit-medium">mg/dL</Typography>
              </View>
              <Typography variant="caption" className="text-[10px] text-text-secondary mt-1">
                {t('dashboard.targetRange', { min: glucoseTargetMin, max: glucoseTargetMax })}
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
                <Typography variant="h2" className="text-2xl font-outfit-bold mr-1">{waterConsumed}</Typography>
                <Typography variant="caption" className="text-xs font-outfit-medium text-text-secondary dark:text-text-secondary-dark">/ {waterGoal} ml</Typography>
              </View>
              <View className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${Math.max(0, Math.min(waterProgress, 1)) * 100}%` }}
                />
              </View>
            </View>
          </Card>
        </View>
      </View>

      {/* Blood Pressure card */}
      <Card className="mb-6 p-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <IconBox icon={Heart} color="#EF4444" bgColor="bg-red-50" size={24} className="mr-4 w-12 h-12" />
            <View>
              <Typography variant="label" className="text-xs uppercase font-outfit-bold">
                {t('common.bloodPressure')}
              </Typography>
              {bpSystolic !== null && bpDiastolic !== null ? (
                <View className="flex-row items-baseline">
                  <Typography variant="h1" className="text-4xl font-outfit-bold mr-1 text-text dark:text-text-dark">
                    {bpSystolic}/{bpDiastolic}
                  </Typography>
                  <Typography variant="h3" className="text-lg font-outfit-semibold text-text-secondary dark:text-text-secondary-dark">
                    mmHg
                  </Typography>
                </View>
              ) : (
                <Typography variant="h1" className="text-4xl font-outfit-bold text-text dark:text-text-dark">
                  --
                </Typography>
              )}
            </View>
          </View>
          {bpStyle && bpCategory && (
            <View className={`${bpStyle.bg} px-3 py-1.5 rounded-2xl flex-row items-center`}>
              <Heart size={14} color={bpStyle.hex} />
              <Typography variant="caption" className={`${bpStyle.text} font-outfit-bold ml-1`}>
                {t(`bloodPressure.cat${bpCategory.charAt(0).toUpperCase() + bpCategory.slice(1)}`)}
              </Typography>
            </View>
          )}
        </View>
      </Card>
    </>
  );
};

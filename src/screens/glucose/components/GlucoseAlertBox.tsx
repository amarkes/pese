import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CheckCircle2, AlertTriangle, ArrowRight, Info } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Typography } from '@/components/atoms/Typography';
import { TFunction } from 'i18next';
import { AppSettings, DEFAULT_SETTINGS, SettingsStorage } from '@/services/SettingsStorage';

type OrientationState = 'low' | 'normal' | 'pre' | 'risky' | 'default';

const parseSettingValue = (value: string, fallback: number) => {
  const parsed = parseFloat(value.replace(',', '.'));
  return Number.isNaN(parsed) ? fallback : parsed;
};

const getOrientationState = (val: number, settings: AppSettings): OrientationState => {
  if (isNaN(val) || val <= 0) return 'default';

  const lowMax = parseSettingValue(settings.glucoseLowMax, 80);
  const normalMin = parseSettingValue(settings.glucoseNormalMin, 81);
  const normalMax = parseSettingValue(settings.glucoseNormalMax, 92);
  const preMin = parseSettingValue(settings.glucosePreMin, 93);
  const preMax = parseSettingValue(settings.glucosePreMax, 150);
  const riskyMin = parseSettingValue(settings.glucoseRiskyMin, 151);

  if (val <= lowMax) return 'low';
  if (val >= normalMin && val <= normalMax) return 'normal';
  if (val >= preMin && val <= preMax) return 'pre';
  if (val >= riskyMin) return 'risky';
  return 'default';
};

const getColors = (state: OrientationState, isDarkMode: boolean) => {
  switch (state) {
    case 'low':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-100 dark:border-blue-900/50',
        title: 'text-blue-700 dark:text-blue-500',
        msg: 'text-blue-800/80 dark:text-blue-400/80',
        icon: '#3B82F6',
        link: 'text-blue-700 dark:text-blue-500',
        linkIcon: isDarkMode ? '#60A5FA' : '#1D4ED8',
      };
    case 'normal':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-100 dark:border-emerald-900/50',
        title: 'text-emerald-700 dark:text-emerald-500',
        msg: 'text-emerald-800/80 dark:text-emerald-400/80',
        icon: '#10B981',
        link: 'text-emerald-700 dark:text-emerald-500',
        linkIcon: isDarkMode ? '#34D399' : '#047857',
      };
    case 'pre':
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/30',
        border: 'border-orange-100 dark:border-orange-900/50',
        title: 'text-orange-700 dark:text-orange-500',
        msg: 'text-orange-800/80 dark:text-orange-400/80',
        icon: '#EA580C',
        link: 'text-orange-700 dark:text-orange-500',
        linkIcon: isDarkMode ? '#F97316' : '#C2410C',
      };
    case 'risky':
      return {
        bg: 'bg-red-50 dark:bg-red-950/30',
        border: 'border-red-100 dark:border-red-900/50',
        title: 'text-red-700 dark:text-red-500',
        msg: 'text-red-800/80 dark:text-red-400/80',
        icon: '#EF4444',
        link: 'text-red-700 dark:text-red-500',
        linkIcon: isDarkMode ? '#F87171' : '#B91C1C',
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-900',
        border: 'border-slate-200 dark:border-slate-800',
        title: 'text-slate-700 dark:text-slate-300',
        msg: 'text-slate-600 dark:text-slate-400',
        icon: '#64748B',
        link: 'text-blue-600 dark:text-blue-500',
        linkIcon: isDarkMode ? '#60A5FA' : '#2563EB',
      };
  }
};

interface GlucoseAlertBoxProps {
  glucoseNum: number;
  isDarkMode: boolean;
  onShowOrientations: () => void;
  t: TFunction;
}

export const GlucoseAlertBox: React.FC<GlucoseAlertBoxProps> = ({
  glucoseNum,
  isDarkMode,
  onShowOrientations,
  t,
}) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSettings = async () => {
        const storedSettings = await SettingsStorage.getSettings();
        if (isActive) {
          setSettings(storedSettings);
        }
      };

      loadSettings();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const state = getOrientationState(glucoseNum, settings);
  const colors = getColors(state, isDarkMode);

  const content = (() => {
    switch (state) {
      case 'low': return { title: t('glucose.msgLowTitle'), desc: t('glucose.msgLow') };
      case 'normal': return { title: t('glucose.msgNormalTitle'), desc: t('glucose.msgNormal') };
      case 'pre': return { title: t('glucose.msgPreTitle'), desc: t('glucose.msgPre') };
      case 'risky': return { title: t('glucose.msgRiskyTitle'), desc: t('glucose.msgRisky') };
      default: return { title: t('glucose.msgDefaultTitle'), desc: t('glucose.msgDefault') };
    }
  })();

  return (
    <View className={`${colors.bg} border ${colors.border} rounded-2xl p-4 mb-6`}>
      <View className="flex-row items-center mb-2">
        {state === 'normal' ? (
          <CheckCircle2 size={20} color={colors.icon} />
        ) : state === 'default' ? (
          <Info size={20} color={colors.icon} />
        ) : (
          <AlertTriangle size={20} color={colors.icon} />
        )}
        <Typography className={`font-outfit-bold ml-2 ${colors.title}`}>
          {content.title}
        </Typography>
      </View>
      <Typography className={`font-outfit mb-3 ${colors.msg}`}>
        {content.desc}
      </Typography>
      <TouchableOpacity
        onPress={onShowOrientations}
        className="flex-row items-center justify-end"
      >
        <Typography className={`font-outfit-bold mr-1 ${colors.link}`}>
          {t('glucose.orientations')}
        </Typography>
        <ArrowRight size={16} color={colors.linkIcon} />
      </TouchableOpacity>
    </View>
  );
};

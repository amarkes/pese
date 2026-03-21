import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Droplet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/atoms/Typography';

export const WaterProgressCircle = ({
  totalConsumed,
  dailyGoal,
  percentage,
  isDarkMode,
  t
}: any) => {
  const { i18n } = useTranslation();
  const radius = 100;
  const strokeW = 16;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - (percentage / 100));

  return (
    <View className="items-center mb-10 mt-4">
      <View className="relative items-center justify-center w-[250px] h-[250px]">
        <Svg width={250} height={250}>
          <Circle cx={125} cy={125} r={radius} stroke={isDarkMode ? '#334155' : '#F1F5F9'} strokeWidth={strokeW} fill="none" />
          <Circle 
            cx={125} cy={125} r={radius} 
            stroke={isDarkMode ? '#34D399' : '#10B981'} 
            strokeWidth={strokeW} 
            fill="none" 
            strokeLinecap="round" 
            strokeDasharray={circumference} 
            strokeDashoffset={dashoffset}
            transform="rotate(-90 125 125)"
          />
        </Svg>
        <View className="absolute items-center justify-center pt-2">
          <Droplet size={28} fill={isDarkMode ? "transparent" : "#10B981"} color={isDarkMode ? "#34D399" : "#10B981"} className="mb-2" />
          <View className="flex-row items-baseline mb-2 mt-1">
            <Typography className="text-5xl tracking-tighter font-outfit-bold text-slate-800 dark:text-white">
              {totalConsumed.toLocaleString(i18n.language)}
            </Typography>
            <Typography className="text-lg font-outfit-medium text-slate-400 dark:text-slate-500 ml-1">
              ml
            </Typography>
          </View>
          <Typography className="text-slate-500 dark:text-slate-400 font-outfit mt-1">
            {t('water.goal', { goal: dailyGoal.toLocaleString(i18n.language) })}
          </Typography>
          <View className="mt-4 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
            <Typography className="text-xs font-outfit-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              {t('water.achieved', { percentage })}
            </Typography>
          </View>
        </View>
      </View>
    </View>
  );
};

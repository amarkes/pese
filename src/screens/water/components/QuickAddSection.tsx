import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Droplet } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';

export const QuickAddSection = ({ onAdd, isDarkMode, t }: any) => {
  return (
    <View className="mb-8">
      <Typography variant="label" className="text-slate-400 dark:text-slate-500 mb-4 tracking-widest uppercase text-xs">
        {t('water.quickAdd')}
      </Typography>
      <View className="flex-row gap-x-3">
        {[200, 300, 500].map(amt => (
          <TouchableOpacity 
            key={amt}
            onPress={() => onAdd(amt)}
            className="flex-1 items-center justify-center py-5 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm shadow-slate-200/50 dark:shadow-none"
          >
            <Droplet size={24} color={isDarkMode ? '#60A5FA' : '#3B82F6'} strokeWidth={1.5} className="mb-2" />
            <Typography className="font-outfit-bold text-slate-800 dark:text-white">
              {amt}ml
            </Typography>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

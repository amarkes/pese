import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';

interface GlucoseHeaderProps {
  title: string;
  isDarkMode: boolean;
  onBack: () => void;
}

export const GlucoseHeader: React.FC<GlucoseHeaderProps> = ({ title, isDarkMode, onBack }) => (
  <View className="flex-row items-center px-6 py-4 justify-between border-b border-slate-100 dark:border-slate-800">
    <TouchableOpacity
      onPress={onBack}
      className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
    >
      <ChevronLeft size={24} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
    </TouchableOpacity>
    <Typography variant="h2" className="text-xl font-outfit-bold text-slate-900 dark:text-white">
      {title}
    </Typography>
    <View className="w-10" />
  </View>
);

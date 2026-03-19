import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Calendar, Clock, ChevronLeft } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';

interface DateTimeSelectorsProps {
  onPressDate: () => void;
  onPressTime: () => void;
  dateLabel: string;
  timeLabel: string;
  isDarkMode: boolean;
}

export const DateTimeSelectors: React.FC<DateTimeSelectorsProps> = ({
  onPressDate,
  onPressTime,
  dateLabel,
  timeLabel,
  isDarkMode
}) => {
  return (
    <View className="flex-row gap-4 mb-8">
      <TouchableOpacity 
        onPress={onPressDate}
        className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Calendar size={20} color={isDarkMode ? "#8E8E93" : "#94A3B8"} className="mr-3" />
          <Typography variant="body" className="font-outfit-semibold text-xs">{dateLabel}</Typography>
        </View>
        <ChevronLeft size={16} color="#94A3B8" style={{ transform: [{ rotate: '-90deg' }] }} />
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={onPressTime}
        className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 flex-row items-center justify-between"
      >
        <View className="flex-row items-center">
          <Clock size={20} color={isDarkMode ? "#8E8E93" : "#94A3B8"} className="mr-3" />
          <Typography variant="body" className="font-outfit-semibold text-xs">{timeLabel}</Typography>
        </View>
        <ChevronLeft size={16} color="#94A3B8" style={{ transform: [{ rotate: '-90deg' }] }} />
      </TouchableOpacity>
    </View>
  );
};

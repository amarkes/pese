import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface HistoryHeaderProps {
  onToggleFilters: () => void;
  isDarkMode: boolean;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({ onToggleFilters, isDarkMode }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <View className="flex-row items-center justify-between px-6 pt-2 pb-0">
      <TouchableOpacity 
        onPress={() => navigation.goBack()}
        className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 shadow-sm"
      >
        <ChevronLeft size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
      </TouchableOpacity>
      
      <Typography variant="h2" className="text-xl font-outfit-bold text-slate-800 dark:text-white">
        {t('history.title')}
      </Typography>
      
      <TouchableOpacity 
        onPress={onToggleFilters}
        className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 shadow-sm"
      >
        <SlidersHorizontal size={20} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
      </TouchableOpacity>
    </View>
  );
};

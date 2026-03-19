import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { useTranslation } from 'react-i18next';
import { HistoryItemType } from '../hooks/useHistory';

interface FilterTabsProps {
  activeFilter: HistoryItemType | 'all';
  setActiveFilter: (filter: HistoryItemType | 'all') => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, setActiveFilter }) => {
  const { t } = useTranslation();
  
  const filters: (HistoryItemType | 'all')[] = ['all', 'weight', 'glucose', 'water', 'sleep'];

  return (
    <View className="border-b border-slate-100 dark:border-slate-800">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        className="px-6 py-1"
      >
        {filters.map(filter => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity 
              key={filter}
              onPress={() => setActiveFilter(filter)}
              className="mr-6 mt-4 items-center"
            >
              <Typography 
                variant="body" 
                className={`${isActive ? 'text-blue-500 font-outfit-medium' : 'text-slate-400 dark:text-slate-500 font-outfit-medium'}`}
              >
                {t(`history.filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`)}
              </Typography>
              {isActive && <View className="h-0.5 w-6 bg-blue-500 mt-1 rounded-full" />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

import React from 'react';
import { View, TextInput } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { TFunction } from 'i18next';

interface ObservationsInputProps {
  observations: string;
  setObservations: (value: string) => void;
  isDarkMode: boolean;
  t: TFunction;
}

export const ObservationsInput: React.FC<ObservationsInputProps> = ({
  observations,
  setObservations,
  isDarkMode,
  t,
}) => (
  <View className="mb-6">
    <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white mb-3">
      {t('glucose.observations')}
    </Typography>
    <TextInput
      value={observations}
      onChangeText={setObservations}
      multiline
      numberOfLines={4}
      className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 min-h-[100px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-outfit"
      placeholder={t('glucose.observationsPlaceholder')}
      placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
      textAlignVertical="top"
    />
  </View>
);

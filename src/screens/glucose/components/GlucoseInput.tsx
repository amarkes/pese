import React from 'react';
import { View, TextInput } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { TFunction } from 'i18next';

interface GlucoseInputProps {
  glucose: string;
  setGlucose: (value: string) => void;
  isDarkMode: boolean;
  inputRef: React.RefObject<TextInput | null>;
  t: TFunction;
}

export const GlucoseInput: React.FC<GlucoseInputProps> = ({
  glucose,
  setGlucose,
  isDarkMode,
  inputRef,
  t,
}) => (
  <View className="mb-6">
    <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white mb-3">
      {t('glucose.glucoseValue')}
    </Typography>
    <View className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 h-20 px-6 flex-row items-center">
      <TextInput
        ref={inputRef}
        value={glucose}
        onChangeText={setGlucose}
        keyboardType="numeric"
        className="flex-1 text-center text-4xl font-outfit-bold text-slate-900 dark:text-white"
        placeholder="000"
        placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
        maxLength={4}
      />
      <Typography className="text-slate-400 font-outfit-medium text-lg absolute right-6">
        mg/dL
      </Typography>
    </View>
  </View>
);

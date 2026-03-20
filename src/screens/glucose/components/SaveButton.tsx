import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Save } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { TFunction } from 'i18next';

interface SaveButtonProps {
  onSave: () => void;
  hasValue: boolean;
  isDarkMode: boolean;
  t: TFunction;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onSave, hasValue, isDarkMode, t }) => (
  <TouchableOpacity
    onPress={onSave}
    disabled={!hasValue}
    className={`rounded-2xl flex-row items-center justify-center p-4 mb-6 ${
      hasValue
        ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
        : 'bg-slate-200 dark:bg-slate-800 shadow-none'
    }`}
  >
    <Save size={20} color={hasValue ? 'white' : isDarkMode ? '#475569' : '#94A3B8'} />
    <Typography
      className={`font-outfit-bold text-lg ml-2 ${
        hasValue ? 'text-white' : 'text-slate-400 dark:text-slate-500'
      }`}
    >
      {t('glucose.saveRecord')}
    </Typography>
  </TouchableOpacity>
);

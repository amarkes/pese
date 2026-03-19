import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Plus, Pencil } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';

export const ManualEntrySection = ({
  manualAmount,
  setManualAmount,
  onSubmit,
  isEditing,
  isDarkMode,
  t
}: any) => {
  return (
    <View className="mb-8">
      <Typography variant="label" className="text-slate-400 dark:text-slate-500 mb-4 tracking-widest uppercase text-xs text-left">
        {isEditing ? t('water.editWater') : t('water.manualEntry')}
      </Typography>
      <View className="flex-row items-center">
        <View className="flex-1 flex-row items-center border border-slate-200 dark:border-slate-800 h-[60px] px-4 rounded-2xl bg-white dark:bg-slate-900 mr-3">
          <TextInput
            value={manualAmount}
            onChangeText={setManualAmount}
            placeholder={t('water.quantityLabel')}
            placeholderTextColor={isDarkMode ? '#64748B' : '#94A3B8'}
            keyboardType="numeric"
            className="flex-1 font-outfit-medium text-slate-900 dark:text-white text-lg h-full"
          />
          <Typography className="text-slate-400 dark:text-slate-500 font-outfit-medium ml-2">
            ml
          </Typography>
        </View>
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!manualAmount}
          className={`w-[60px] h-[60px] rounded-2xl items-center justify-center ${manualAmount ? 'bg-blue-600 shadow-lg shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-800'}`}
        >
          {isEditing ? (
            <Pencil size={24} color={manualAmount ? 'white' : (isDarkMode ? '#475569' : '#94A3B8')} />
          ) : (
            <Plus size={24} color={manualAmount ? 'white' : (isDarkMode ? '#475569' : '#94A3B8')} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

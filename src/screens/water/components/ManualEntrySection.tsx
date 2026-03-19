import React from 'react';
import { View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
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
  const isFilled = manualAmount && manualAmount.length > 0;
  
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
          disabled={!isFilled}
          className="w-[60px] h-[60px] rounded-2xl items-center justify-center"
          style={[
            isFilled 
              ? styles.buttonFilled 
              : isDarkMode 
                ? styles.buttonEmptyDark 
                : styles.buttonEmptyLight
          ]}
        >
          {isEditing ? (
            <Pencil size={24} color={isFilled ? 'white' : (isDarkMode ? '#475569' : '#94A3B8')} />
          ) : (
            <Plus size={24} color={isFilled ? 'white' : (isDarkMode ? '#475569' : '#94A3B8')} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonFilled: {
    backgroundColor: '#2563EB',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  buttonEmptyDark: {
    backgroundColor: '#1E293B'
  },
  buttonEmptyLight: {
    backgroundColor: '#E2E8F0'
  }
});

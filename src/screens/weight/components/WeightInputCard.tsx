import React from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Card } from '@/components/molecules/Card';
import { Typography } from '@/components/atoms/Typography';

interface WeightInputCardProps {
  weight: string;
  setWeight: (weight: string) => void;
  isDarkMode: boolean;
  inputRef: React.RefObject<any>;
}

export const WeightInputCard: React.FC<WeightInputCardProps> = ({ 
  weight, 
  setWeight, 
  isDarkMode, 
  inputRef 
}) => {
  return (
    <Card className="items-center justify-center pt-10 pb-12 mb-8 bg-white dark:bg-slate-900 border-none shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[220px]">
      <View className="flex-row items-center justify-center w-full">
        <TextInput
          ref={inputRef}
          className="text-7xl font-inter-bold text-text-light dark:text-text-dark text-center min-w-[200px] py-4"
          style={Platform.select({
            ios: { height: 120, verticalAlign: 'middle' },
            android: { includeFontPadding: false, textAlignVertical: 'center' }
          })}
          placeholder="00.0"
          placeholderTextColor={isDarkMode ? "#334155" : "#F1F5F9"}
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
          autoFocus
        />
        <Typography variant="h2" className="text-3xl font-inter-bold text-text-secondary/30 dark:text-text-secondary-dark/30 absolute right-8 bottom-12">kg</Typography>
      </View>
      <View className="w-12 h-1.5 bg-blue-500 rounded-full mt-2" />
    </Card>
  );
};

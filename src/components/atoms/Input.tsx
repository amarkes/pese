import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Typography } from '../atoms/Typography';

interface InputProps extends TextInputProps {
  label?: string;
  suffix?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ label, suffix, className = '', ...props }) => {
  return (
    <View className={`flex-1 ${className}`}>
      {label && <Typography variant="caption" className="mb-2 font-inter-semibold text-text-secondary">{label}</Typography>}
      <View className="bg-slate-50 border border-slate-100 rounded-2xl flex-row items-center px-4 h-16">
        <TextInput 
          className="flex-1 text-lg font-inter-medium text-text" 
          placeholderTextColor="#9CA3AF"
          {...props} 
        />
        {suffix && <Typography variant="caption" className="ml-2 font-inter-bold opacity-30">{suffix}</Typography>}
      </View>
    </View>
  );
};

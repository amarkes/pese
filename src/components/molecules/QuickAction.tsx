import React from 'react';
import { TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { IconBox } from '@/components/atoms/IconBox';

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  color: string;
  bgColor: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({ 
  icon, 
  label, 
  onPress, 
  color, 
  bgColor 
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      className="bg-white dark:bg-slate-900 rounded-3xl p-4 items-center justify-center flex-1 mx-2 shadow-sm border border-slate-50/5 dark:border-slate-800 h-24"
    >
      <IconBox icon={icon} color={color} bgColor={bgColor} size={28} className="mb-3" />
      <Typography variant="caption" className="font-outfit-medium text-center text-text dark:text-text-dark leading-tight px-1">
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

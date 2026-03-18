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
      className="bg-white rounded-3xl p-4 items-center justify-center flex-1 mx-1 shadow-sm h-32"
    >
      <IconBox icon={icon} color={color} bgColor={bgColor} size={28} className="mb-3" />
      <Typography variant="caption" className="font-inter-bold text-center text-text leading-tight px-1">
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

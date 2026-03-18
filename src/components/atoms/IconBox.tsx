import React from 'react';
import { View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface IconBoxProps {
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
  size?: number;
  className?: string;
}

export const IconBox: React.FC<IconBoxProps> = ({ 
  icon: Icon, 
  color = '#007AFF', 
  bgColor = 'bg-blue-50', 
  size = 24,
  className = ''
}) => {
  return (
    <View 
      className={`w-12 h-12 rounded-xl items-center justify-center ${bgColor} ${className}`}
    >
      <Icon size={size} color={color} />
    </View>
  );
};

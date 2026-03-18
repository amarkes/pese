import React from 'react';
import { View } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';


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
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View 
      className={`w-12 h-12 rounded-xl items-center justify-center ${bgColor} dark:bg-slate-800 ${className}`}
    >
      <Icon size={size} color={isDarkMode ? (color === '#007AFF' ? '#60A5FA' : color) : color} />
    </View>
  );
};

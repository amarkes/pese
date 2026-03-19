import React from 'react';
import { View, Switch, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Typography } from '@/components/atoms/Typography';
import { ChevronRight } from 'lucide-react-native';


interface SettingRowProps {
  label: string;
  subtitle?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
  type?: 'toggle' | 'link';
}

export const SettingRow: React.FC<SettingRowProps> = ({ 
  label, 
  subtitle, 
  value, 
  onValueChange, 
  onPress, 
  type = 'toggle' 
}) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container 
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center justify-between py-4 border-b border-slate-50 dark:border-slate-800"
    >

      <View className="flex-1 mr-4">
        <Typography variant="body" className="text-lg font-outfit-semibold text-text dark:text-text-dark">{label}</Typography>
        {subtitle && (
            <Typography variant="caption" className="text-xs font-outfit leading-relaxed text-text-secondary dark:text-text-secondary-dark mt-1">
                {subtitle}
            </Typography>
        )}
      </View>
      
      {type === 'toggle' ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: isDarkMode ? '#1E293B' : '#E2E8F0', true: '#3B82F6' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={isDarkMode ? '#1E293B' : '#E2E8F0'}
        />
      ) : (
        <ChevronRight size={20} color={isDarkMode ? "#64748B" : "#94A3B8"} />
      )}

    </Container>
  );
};

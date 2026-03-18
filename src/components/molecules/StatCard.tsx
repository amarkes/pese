import React from 'react';
import { View } from 'react-native';
import { Card } from './Card';
import { Typography } from '@/components/atoms/Typography';
import { IconBox } from '@/components/atoms/IconBox';
import { LucideIcon } from 'lucide-react-native';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: string;
  trendColor?: string;
  trendBgColor?: string;
  className?: string;
  subtitle?: string;
  progress?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  unit = '', 
  icon, 
  iconColor, 
  iconBgColor, 
  trend,
  trendColor = 'text-emerald-500',
  trendBgColor = 'bg-emerald-50',
  className = '',
  subtitle,
  progress,
}) => {
  return (
    <Card className={`mb-4 overflow-hidden ${className}`}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          {icon && (
            <IconBox 
              icon={icon} 
              color={iconColor} 
              bgColor={iconBgColor} 
              size={20} 
              className="w-10 h-10 mr-3"
            />
          )}
          <Typography variant="label">{label}</Typography>
        </View>
        
        {trend && (
          <View className={`px-2 py-0.5 rounded-full ${trendBgColor}`}>
            <Typography variant="caption" className={`text-xs font-inter-bold ${trendColor}`}>
              📉 {trend}
            </Typography>
          </View>
        )}
      </View>
      
      <View className="flex-row items-baseline mb-1">
        <Typography variant="h1" className="text-3xl font-inter-bold mr-1">{value}</Typography>
        {unit && <Typography variant="h3" className="text-xl font-inter-semibold text-text-secondary">{unit}</Typography>}
      </View>
      
      {subtitle && (
        <Typography variant="caption" className="text-xs mb-2">
          {subtitle}
        </Typography>
      )}

      {progress !== undefined && (
        <View className="w-full h-2 bg-slate-100 rounded-full mt-2">
          <View 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: `${progress * 100}%` }} 
          />
        </View>
      )}
    </Card>
  );
};

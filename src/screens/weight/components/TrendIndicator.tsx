import React from 'react';
import { View } from 'react-native';
import { TrendingDown, TrendingUp } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';

interface TrendIndicatorProps {
  hasDiff: boolean;
  weightDiff: number;
  diffLabel: string;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  hasDiff,
  weightDiff,
  diffLabel
}) => {
  if (!hasDiff) return null;

  return (
    <View className={`rounded-3xl p-5 flex-row items-center justify-center mb-10 ${weightDiff <= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-orange-50 dark:bg-orange-950/20'}`}>
      {weightDiff <= 0 ? (
        <TrendingDown size={20} color="#10B981" className="mr-3" />
      ) : (
        <TrendingUp size={20} color="#F97316" className="mr-3" />
      )}
      <Typography 
        variant="body" 
        className={`font-outfit-semibold ${weightDiff <= 0 ? 'text-emerald-500' : 'text-orange-500'}`}
      >
        {diffLabel}
      </Typography>
    </View>
  );
};

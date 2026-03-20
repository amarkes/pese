import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { TFunction } from 'i18next';

type MeasurementType = 'fasting' | 'preMeal' | 'postMeal' | 'random';

interface MeasurementTypeSelectorProps {
  measurementType: MeasurementType;
  setMeasurementType: (type: MeasurementType) => void;
  t: TFunction;
}

export const MeasurementTypeSelector: React.FC<MeasurementTypeSelectorProps> = ({
  measurementType,
  setMeasurementType,
  t,
}) => {
  const types: { id: MeasurementType; label: string }[] = [
    { id: 'fasting', label: t('glucose.fasting') },
    { id: 'preMeal', label: t('glucose.preMeal') },
    { id: 'postMeal', label: t('glucose.postMeal') },
    { id: 'random', label: t('glucose.random') },
  ];

  return (
    <View className="mb-6">
      <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white mb-3">
        {t('glucose.measurementType')}
      </Typography>
      <View className="flex-row flex-wrap gap-2">
        {types.map((type) => {
          const isSelected = measurementType === type.id;
          return (
            <TouchableOpacity
              key={type.id}
              onPress={() => setMeasurementType(type.id)}
              className={`py-3 px-4 rounded-xl flex-1 min-w-[45%] items-center justify-center flex-row ${
                isSelected ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              {isSelected && <CheckCircle2 size={16} color="white" className="absolute left-3" />}
              <Typography
                className={`font-outfit-semibold ml-2 ${
                  isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {type.label}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

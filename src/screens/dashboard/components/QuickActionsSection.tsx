import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Weight, Droplets, Activity, Heart, LucideIcon } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { QuickAction } from '@/components/molecules/QuickAction';

type QuickActionItem = {
  key: string;
  icon: LucideIcon;
  labelKey: string;
  color: string;
  bgColor: string;
  route: string;
};

const ITEMS_PER_ROW = 2;

const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

export const QuickActionsSection: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const actions: QuickActionItem[] = useMemo(
    () => [
      {
        key: 'weight',
        icon: Weight,
        labelKey: 'common.weight',
        color: '#007AFF',
        bgColor: 'bg-blue-50',
        route: 'RegisterWeight',
      },
      {
        key: 'glucose',
        icon: Activity,
        labelKey: 'common.glucose',
        color: '#F97316',
        bgColor: 'bg-orange-50',
        route: 'RegisterGlucose',
      },
      {
        key: 'water',
        icon: Droplets,
        labelKey: 'common.water',
        color: '#3B82F6',
        bgColor: 'bg-blue-50',
        route: 'RegisterWater',
      },
      {
        key: 'bloodPressure',
        icon: Heart,
        labelKey: 'common.bloodPressure',
        color: '#EF4444',
        bgColor: 'bg-red-50',
        route: 'RegisterBloodPressure',
      },
    ],
    [],
  );

  const rows = useMemo(() => chunk(actions, ITEMS_PER_ROW), [actions]);

  return (
    <>
      <Typography variant="h2" className="text-2xl font-outfit-bold mb-6 mt-2">
        {t('dashboard.quickActions')}
      </Typography>
      {rows.map((row, rowIndex) => {
        const missing = ITEMS_PER_ROW - row.length;

        return (
          <View
            key={`quick-actions-row-${rowIndex}`}
            className={'flex-row mb-5'}
          >
            {row.map((action) => (
              <QuickAction
                key={action.key}
                icon={action.icon}
                label={`${t('common.register')} ${t(action.labelKey)}`}
                color={action.color}
                bgColor={action.bgColor}
                onPress={() => navigation.navigate(action.route)}
              />
            ))}
            {Array.from({ length: missing }).map((_, i) => (
              <View key={`placeholder-${rowIndex}-${i}`} className="flex-1 mx-1" />
            ))}
          </View>
        );
      })}
    </>
  );
};

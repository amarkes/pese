import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../../components/atoms/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black items-center justify-center">
      <Typography variant="h2">{t('tabs.profile')}</Typography>
    </SafeAreaView>
  );
};

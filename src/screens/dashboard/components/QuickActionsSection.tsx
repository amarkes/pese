import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Weight, Droplets, Activity } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { QuickAction } from '@/components/molecules/QuickAction';

export const QuickActionsSection: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <>
      <Typography variant="h2" className="text-2xl font-outfit-bold mb-6 mt-2">
        {t('dashboard.quickActions')}
      </Typography>
      <View className="flex-row mb-6">
        <QuickAction 
          icon={Weight} 
          label={`${t('common.register')} ${t('common.weight')}`} 
          color="#007AFF" 
          bgColor="bg-blue-50" 
          onPress={() => navigation.navigate('RegisterWeight')} 
        />
        <QuickAction 
          icon={Activity} 
          label={`${t('common.register')} ${t('common.glucose')}`} 
          color="#F97316" 
          bgColor="bg-orange-50" 
          onPress={() => navigation.navigate('RegisterGlucose')} 
        />
        <QuickAction 
          icon={Droplets} 
          label={`${t('common.register')} ${t('common.water')}`} 
          color="#3B82F6" 
          bgColor="bg-blue-50" 
          onPress={() => navigation.navigate('RegisterWater')} 
        />
      </View>
    </>
  );
};

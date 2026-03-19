import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Save } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { Typography } from '@/components/atoms/Typography';
import { SettingRow } from '@/components/molecules/SettingRow';

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useColorScheme();
  
  const [notifications, setNotifications] = useState(true);
  const isDarkMode = colorScheme === 'dark';


  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 justify-between">
        <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800">
          <ChevronLeft size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold">{t('settings.title')}</Typography>
        <View className="w-10" />
      </View>


      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-6">
        
        <Typography variant="label" className="text-primary font-outfit-bold tracking-widest mb-6">
          {t('settings.personalGoals')}
        </Typography>

        <View className="mb-6">
          <Typography variant="caption" className="mb-2 font-outfit-semibold text-text-secondary">
            {t('settings.weightGoal')}
          </Typography>
          <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-16">
            <Text className="flex-1 text-lg font-outfit-medium text-text-light dark:text-text-dark">75.5</Text>
            <Typography variant="caption" className="ml-2 font-outfit-bold opacity-30">kg</Typography>
          </View>
        </View>


        <View className="flex-row gap-4 mb-6">
          <View className="flex-1">
            <Typography variant="caption" className="mb-2 font-outfit-semibold text-text-secondary">
                {t('settings.minGlucose')}
            </Typography>
            <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-16">
                <Text className="flex-1 text-lg font-outfit-medium text-text-light dark:text-text-dark">70</Text>
                <Typography variant="caption" className="ml-2 font-outfit-bold opacity-30">mg/dL</Typography>
            </View>
          </View>
          <View className="flex-1">
            <Typography variant="caption" className="mb-2 font-outfit-semibold text-text-secondary">
                {t('settings.maxGlucose')}
            </Typography>
            <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-16">
                <Text className="flex-1 text-lg font-outfit-medium text-text-light dark:text-text-dark">130</Text>
                <Typography variant="caption" className="ml-2 font-outfit-bold opacity-30">mg/dL</Typography>
            </View>
          </View>
        </View>


        <View className="mb-10">
          <Typography variant="caption" className="mb-2 font-outfit-semibold text-text-secondary">
            {t('settings.dailyWaterGoal')}
          </Typography>
          <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-16">
            <Text className="flex-1 text-lg font-outfit-medium text-text-light dark:text-text-dark">2500</Text>
            <Typography variant="caption" className="ml-2 font-outfit-bold opacity-30">ml</Typography>
          </View>
        </View>

        {/* Section: Preferences */}
        <Typography variant="label" className="text-primary font-outfit-bold tracking-widest mb-6 border-t border-slate-50 dark:border-slate-800 pt-8">
          {t('settings.preferences')}
        </Typography>


        <SettingRow 
           label={t('settings.dailyNotifications')}
           subtitle={t('settings.reminders')}
           value={notifications}
           onValueChange={setNotifications}
        />
        
        <SettingRow 
           label={t('settings.darkMode')}
           subtitle={t('settings.appearance')}
           value={isDarkMode}
           onValueChange={(value) => setColorScheme(value ? 'dark' : 'light')}
        />


        <SettingRow 
           label={t('settings.units')}
           subtitle={t('settings.unitsSubtitle')}
           type="link"
           onPress={() => console.log('Change Units')}
        />

        {/* Save Button */}
        <TouchableOpacity 
          className="bg-primary rounded-2xl py-5 mt-10 mb-20 flex-row items-center justify-center shadow-lg shadow-blue-500/30"
          activeOpacity={0.8}
        >
          <Save size={20} color="white" className="mr-3" />
          <Typography variant="h3" className="text-white ml-2">{t('settings.save')}</Typography>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};

export default SettingsScreen;

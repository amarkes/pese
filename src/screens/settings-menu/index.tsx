import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, CircleHelp, FileSpreadsheet, Settings, Shield } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { Card } from '@/components/molecules/Card';
import { Typography } from '@/components/atoms/Typography';

const SettingsMenuScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const menuItems = [
    {
      key: 'app',
      title: t('menu.appSettingsTitle'),
      subtitle: t('menu.appSettingsSubtitle'),
      route: 'AppSettings',
      Icon: Settings,
    },
    {
      key: 'transfer',
      title: t('menu.transferTitle'),
      subtitle: t('menu.transferSubtitle'),
      route: 'DataTransfer',
      Icon: FileSpreadsheet,
    },
    {
      key: 'help',
      title: t('menu.helpTitle'),
      subtitle: t('menu.helpSubtitle'),
      route: 'HelpCenter',
      Icon: CircleHelp,
    },
    {
      key: 'privacy',
      title: t('menu.privacyTitle'),
      subtitle: t('menu.privacySubtitle'),
      route: 'PrivacyPolicy',
      Icon: Shield,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top', 'bottom']}>
      <View className="px-6 pb-4 pt-6">
        <Typography variant="h1" className="font-outfit-bold text-slate-900 dark:text-white">
          {t('menu.title')}
        </Typography>
        <Typography className="text-lg mt-2 font-outfit-medium text-slate-500 dark:text-slate-400">
          {t('menu.subtitle')}
        </Typography>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.key}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.85}
            className="mb-4"
          >
            <Card className="p-5">
              <View className="flex-row items-center">
                <View className="mr-4 h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30">
                  <item.Icon size={24} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
                </View>
                <View className="flex-1 pr-3">
                  <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white">
                    {item.title}
                  </Typography>
                  <Typography className="text-lg mt-1 font-outfit-medium text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </Typography>
                </View>
                <ChevronRight size={20} color={isDarkMode ? '#64748B' : '#94A3B8'} />
              </View>
            </Card>
          </TouchableOpacity>
        ))}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsMenuScreen;

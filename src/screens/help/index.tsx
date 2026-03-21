import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CircleHelp } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { Card } from '@/components/molecules/Card';
import { Typography } from '@/components/atoms/Typography';

const HelpScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const sections = [
    {
      title: t('help.sectionRecordsTitle'),
      body: t('help.sectionRecordsBody'),
    },
    {
      title: t('help.sectionNotificationsTitle'),
      body: t('help.sectionNotificationsBody'),
    },
    {
      title: t('help.sectionTransferTitle'),
      body: t('help.sectionTransferBody'),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between border-b border-slate-50 px-6 py-4 dark:border-slate-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
        >
          <ChevronLeft size={24} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold text-slate-900 dark:text-white">
          {t('help.title')}
        </Typography>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Card className="mb-5 p-5">
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30">
              <CircleHelp size={22} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
            </View>
            <View className="flex-1">
              <Typography variant="h2" className="font-outfit-bold text-slate-900 dark:text-white">
                {t('help.heroTitle')}
              </Typography>
              <Typography className="mt-1 font-outfit-medium text-slate-500 dark:text-slate-400">
                {t('help.heroSubtitle')}
              </Typography>
            </View>
          </View>
        </Card>

        {sections.map(section => (
          <Card key={section.title} className="mb-5 p-5">
            <Typography variant="h3" className="mb-3 font-outfit-bold tracking-widest text-primary">
              {section.title}
            </Typography>
            <Typography className="text-lg font-outfit-medium leading-6 text-slate-600 dark:text-slate-300">
              {section.body}
            </Typography>
          </Card>
        ))}

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HelpScreen;

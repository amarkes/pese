import React from 'react';
import { ScrollView, View, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Weight, Droplets, Activity, Zap } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';

import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { IconBox } from '@/components/atoms/IconBox';
import { QuickAction } from '@/components/molecules/QuickAction';
import { LineChart } from 'react-native-chart-kit';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-background-dark" edges={['top']}>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-5 pt-4">
        
        {/* Quick Actions */}
        <Typography variant="h2" className="text-2xl font-outfit-bold mb-6 mt-2">{t('dashboard.quickActions')}</Typography>
        <View className="flex-row mb-6">
          <QuickAction 
            icon={Weight} 
            label={`${t('common.register')} ${t('common.weight')}`} 
            color="#007AFF" 
            bgColor="bg-blue-50" 
            onPress={() => console.log('Registrar Peso')} 
          />
          <QuickAction 
            icon={Activity} 
            label={`${t('common.register')} ${t('common.glucose')}`} 
            color="#F97316" 
            bgColor="bg-orange-50" 
            onPress={() => console.log('Registrar Glicose')} 
          />
          <QuickAction 
            icon={Droplets} 
            label={`${t('common.register')} ${t('common.water')}`} 
            color="#3B82F6" 
            bgColor="bg-blue-50" 
            onPress={() => console.log('Registrar Água')} 
          />
        </View>

        {/* Summary title */}
        <View className="flex-row items-end justify-between mb-6">
          <Typography variant="h2" className="text-2xl font-outfit-medium">{t('dashboard.todaySummary')}</Typography>
          <TouchableOpacity>
            <Typography variant="caption" className="text-primary font-outfit-medium">{t('common.viewDetails')}</Typography>
          </TouchableOpacity>
        </View>

        {/* Large weight card */}
        <Card className="mb-6 p-6">
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-row items-center">
              <IconBox icon={Weight} color="#007AFF" bgColor="bg-blue-50" size={24} className="mr-4 w-12 h-12" />
              <View>
                <Typography variant="label" className="text-xs uppercase font-outfit-bold">{t('dashboard.lastWeight')}</Typography>
                <View className="flex-row items-baseline">
                  <Typography variant="h1" className="text-4xl font-outfit-bold mr-2 text-text dark:text-text-dark">75.5</Typography>
                  <Typography variant="h3" className="text-2xl font-outfit-semibold text-text-secondary dark:text-text-secondary-dark">kg</Typography>
                </View>

              </View>
            </View>
            <View className="bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-2xl flex-row items-center">
              <Zap size={14} color="#10B981" />
              <Typography variant="caption" className="text-emerald-500 font-outfit-bold ml-1">-0.2</Typography>
            </View>

          </View>
        </Card>

        {/* Mini stats grid */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1">
            <Card className="p-5 h-44 justify-between">
              <IconBox icon={Activity} color="#F97316" bgColor="bg-orange-50" size={20} className="w-12 h-12" />
              <View className="mt-4">
                <Typography variant="label" className="mb-1">{t('common.glucose')}</Typography>
                <View className="flex-row items-baseline">
                  <Typography variant="h2" className="text-2xl font-outfit-bold mr-1">92</Typography>
                  <Typography variant="caption" className="text-xs font-outfit-medium">mg/dL</Typography>
                </View>
                <Typography variant="caption" className="text-[10px] text-text-secondary mt-1">{t('dashboard.targetRange', { min: 70, max: 100 })}</Typography>
              </View>
            </Card>
          </View>
          <View className="flex-1">
            <Card className="p-5 h-44 justify-between">
              <IconBox icon={Droplets} color="#3B82F6" bgColor="bg-blue-50" size={20} className="w-12 h-12" />
              <View className="mt-4">
                <Typography variant="label" className="mb-1">{t('common.water')}</Typography>
                <View className="flex-row items-baseline">
                  <Typography variant="h2" className="text-2xl font-outfit-bold mr-1">1200</Typography>
                  <Typography variant="caption" className="text-xs font-outfit-medium text-text-secondary dark:text-text-secondary-dark">/ 2500 ml</Typography>
                </View>
                 {/* Progress bar */}
                <View className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <View className="h-full bg-blue-500 rounded-full w-[48%]" />
                </View>

              </View>
            </Card>
          </View>
        </View>

        {/* Trend Section */}
        <Card className="mb-8 p-6">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Typography variant="label" className="mb-1">{t('dashboard.trend7days')}</Typography>
              <View className="flex-row items-center">
                <Typography variant="h2" className="text-3xl font-outfit-bold mr-3">75.5 kg</Typography>
                <Typography variant="caption" className="text-emerald-500 font-outfit-bold">-0.3%</Typography>
              </View>
            </View>
            <IconBox icon={Activity} color="#6C6C70" bgColor="bg-slate-50" size={20} className="w-10 h-10" />
          </View>

          {/* Simple Chart */}
          <LineChart
            data={{
              labels: t('dashboard.days', { returnObjects: true }) as string[],
              datasets: [{ data: [76.1, 75.9, 75.7, 75.8, 75.6, 75.4, 75.5], color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, strokeWidth: 4 }]
            }}
            width={SCREEN_WIDTH - 80}
            height={160}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLabels={true}
            withHorizontalLabels={false}
            chartConfig={{
              backgroundColor: isDarkMode ? '#1C1C1E' : '#fff',
              backgroundGradientFrom: isDarkMode ? '#1C1C1E' : '#fff',
              backgroundGradientTo: isDarkMode ? '#1C1C1E' : '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
              labelColor: (opacity = 1) => isDarkMode ? `rgba(142, 142, 147, ${opacity})` : `rgba(108, 108, 112, ${opacity})`,
              propsForLabels: { fontFamily: 'Inter_18pt-Medium', fontSize: 10 },
              style: { borderRadius: 16 }
            }}

            bezier
            style={styles.chart}
          />
        </Card>

        {/* Extra space for scrolling */}
        <View className="h-20" />
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chart: {
    marginVertical: 8,
    marginLeft: -20,
  },
});

export default DashboardScreen;

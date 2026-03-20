import React from 'react';
import { ScrollView, View, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Save, Plus, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { SettingRow } from '@/components/molecules/SettingRow';
import { useSettings } from './hooks/useSettings';
import { AppSettings } from '@/services/SettingsStorage';

const SettingsScreen: React.FC = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const {
    settings,
    updateSetting,
    updateBooleanSetting,
    updateWaterQuickAdd,
    addWaterQuickAdd,
    removeWaterQuickAdd,
    handleSave,
    calculateRecommendedWater,
    notificationWarning,
    t,
    navigation
  } = useSettings();

  type StringSettingKey = {
    [K in keyof AppSettings]: AppSettings[K] extends string ? K : never;
  }[keyof AppSettings];

  const renderInput = (labelKey: string, valueKey: StringSettingKey, unit?: string, placeholder?: string) => (
    <View className="mb-6">
      <Typography variant="caption" className="mb-2 font-outfit-semibold text-slate-500 dark:text-slate-400">
        {t(`settings.${labelKey}`)}
      </Typography>
      <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-16">
        <TextInput
          value={settings[valueKey]}
          onChangeText={(val) => updateSetting(valueKey, val)}
          keyboardType="numeric"
          maxLength={valueKey === 'birthDate' ? 10 : undefined}
          className="flex-1 mt-[-10px] text-lg font-outfit-medium text-slate-900 dark:text-white py-0"
          style={styles.textInput}
          placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
          placeholder={placeholder}
        />
        {unit && (
          <Typography className="ml-2 font-outfit-bold text-slate-400 dark:text-slate-500 opacity-60">
            {unit}
          </Typography>
        )}
      </View>
    </View>
  );

  const renderPhaseInputs = (titleKey: string, minKey: StringSettingKey, maxKey: StringSettingKey) => (
    <View className="mb-6">
      <Typography className="mb-2 font-outfit-semibold text-slate-500 dark:text-slate-400">
        {t(`settings.${titleKey}`)}
      </Typography>
      <View className="flex-row gap-4">
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-14">
          <Typography className="mr-2 text-slate-400 font-outfit text-xs uppercase tracking-wider">Mín</Typography>
          <TextInput
            value={settings[minKey]}
            onChangeText={val => updateSetting(minKey, val)}
            keyboardType="numeric"
            placeholder="0"
            className="flex-1 font-outfit-medium text-slate-900 dark:text-white text-right py-0"
            style={styles.textInput}
          />
        </View>
        <View className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-14">
          <Typography className="mr-2 text-slate-400 font-outfit text-xs uppercase tracking-wider">Máx</Typography>
          <TextInput
            value={settings[maxKey]}
            onChangeText={val => updateSetting(maxKey, val)}
            keyboardType="numeric"
            placeholder="0"
            className="mt-[-10px] flex-1 font-outfit-medium text-slate-900 dark:text-white text-right py-0"
            style={styles.textInput}
          />
        </View>
      </View>
    </View>
  );

  const renderTimeInput = (labelKey: string, valueKey: StringSettingKey, placeholder: string) => (
    <View className="mb-4">
      <Typography variant="caption" className="mb-2 font-outfit-semibold text-slate-500 dark:text-slate-400">
        {t(`settings.${labelKey}`)}
      </Typography>
      <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-14">
        <TextInput
          value={settings[valueKey]}
          onChangeText={(val) => updateSetting(valueKey, val)}
          keyboardType="numeric"
          maxLength={5}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
          className="flex-1 font-outfit-medium text-slate-900 dark:text-white py-0"
          style={styles.textInput}
        />
      </View>
    </View>
  );

  const renderNotificationNumberInput = (
    labelKey: string,
    valueKey: StringSettingKey,
    placeholder: string
  ) => (
    <View className="mb-4">
      <Typography variant="caption" className="mb-2 font-outfit-semibold text-slate-500 dark:text-slate-400">
        {t(`settings.${labelKey}`)}
      </Typography>
      <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-14">
        <TextInput
          value={settings[valueKey]}
          onChangeText={(val) => updateSetting(valueKey, val)}
          keyboardType="numeric"
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
          className="flex-1 font-outfit-medium text-slate-900 dark:text-white py-0"
          style={styles.textInput}
        />
      </View>
    </View>
  );

  const renderCardTitle = (label: string) => (
    <Typography variant="label" className="text-primary font-outfit-bold tracking-widest mb-6">
      {label}
    </Typography>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 justify-between">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
        >
          <ChevronLeft size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold text-slate-900 dark:text-white">
          {t('settings.title')}
        </Typography>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-6">
        <Card className="mb-5 p-5">
          {renderCardTitle(t('settings.personalGoals'))}
          {renderInput('weightGoal', 'weightGoal', 'kg')}
          {renderInput('height', 'height', 'cm')}
          {renderInput('birthDate', 'birthDate', '', 'DD/MM/AAAA')}
        </Card>

        <Card className="mb-5 p-5">
          {renderCardTitle(t('settings.glucosePhases'))}
          {renderPhaseInputs('glucoseLow', 'glucoseLowMin', 'glucoseLowMax')}
          {renderPhaseInputs('glucoseNormal', 'glucoseNormalMin', 'glucoseNormalMax')}
          {renderPhaseInputs('glucosePre', 'glucosePreMin', 'glucosePreMax')}
          <View className="mb-0">
            {renderPhaseInputs('glucoseRisky', 'glucoseRiskyMin', 'glucoseRiskyMax')}
          </View>
        </Card>

        <Card className="mb-5 p-5">
          {renderCardTitle(t('settings.dailyWaterGoal'))}
          <View className="mb-6">
            <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center px-4 h-16">
              <TextInput
                value={settings.waterGoal}
                onChangeText={(val) => updateSetting('waterGoal', val)}
                keyboardType="numeric"
                className="mt-[-10px] flex-1 text-lg font-outfit-medium text-slate-900 dark:text-white py-0"
                style={styles.textInput}
                placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
              />
              <Typography className="ml-2 font-outfit-bold text-slate-400 dark:text-slate-500 opacity-60">
                ml
              </Typography>
            </View>
            <Typography className="mt-3 text-emerald-600 dark:text-emerald-400 font-outfit-medium text-sm">
              {t('settings.recommendedWater', { recommended: calculateRecommendedWater() })}
            </Typography>
          </View>

          <Typography variant="caption" className="mb-2 font-outfit-semibold text-slate-500 dark:text-slate-400">
            {t('settings.waterQuickAdds')}
          </Typography>
          <View className="flex-row flex-wrap gap-3 mt-2">
            {(settings.waterQuickAdds || ['200', '300', '500']).map((amount, index) => (
              <View key={index} className="w-[31%]">
                <View className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex-row items-center pl-1 pr-2 h-14 w-full">
                  <TouchableOpacity 
                    onPress={() => removeWaterQuickAdd(index)}
                    className="w-7 h-7 items-center justify-center bg-red-50/50 dark:bg-red-900/20 rounded-full"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <X size={14} strokeWidth={3} color={isDarkMode ? "#F87171" : "#EF4444"} />
                  </TouchableOpacity>
                  <TextInput
                    value={amount}
                    onChangeText={(val) => updateWaterQuickAdd(index, val)}
                    keyboardType="numeric"
                    className="mt-[-10px] flex-1 text-base font-outfit-medium text-slate-900 dark:text-white text-right py-0 pr-1"
                    style={styles.textInput}
                    placeholder="0"
                    placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
                  />
                  <Typography className="font-outfit-bold text-slate-400 dark:text-slate-500 opacity-60 text-xs">
                    ml
                  </Typography>
                </View>
              </View>
            ))}
            <TouchableOpacity 
              onPress={addWaterQuickAdd}
              className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-2xl items-center justify-center h-14 border-dashed w-[31%]"
            >
              <Plus size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
            </TouchableOpacity>
          </View>
        </Card>

        <Card className="mb-5 p-5">
          {renderCardTitle(t('settings.notificationsSection'))}
          {notificationWarning ? (
            <View className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/20">
              <Typography className="font-outfit-medium text-red-600 dark:text-red-400">
                {notificationWarning}
              </Typography>
            </View>
          ) : null}
          <SettingRow 
             label={t('settings.weightReminder')}
             subtitle={t('settings.weightReminderSubtitle')}
             value={settings.weightReminderEnabled}
             onValueChange={(value) => updateBooleanSetting('weightReminderEnabled', value)}
          />
          {settings.weightReminderEnabled ? (
            <View className="mb-4 mt-4">
              {renderTimeInput('reminderTime', 'weightReminderTime', '09:00')}
            </View>
          ) : null}

          <SettingRow 
             label={t('settings.glucoseReminders')}
             subtitle={t('settings.glucoseRemindersSubtitle')}
             value={settings.glucoseRemindersEnabled}
             onValueChange={(value) => updateBooleanSetting('glucoseRemindersEnabled', value)}
          />
          {settings.glucoseRemindersEnabled ? (
            <View className="mb-4 mt-4">
              {renderTimeInput('fastingTime', 'glucoseFastingTime', '07:00')}
              {renderTimeInput('preMealTime', 'glucosePreMealTime', '11:30')}
              {renderTimeInput('postMealTime', 'glucosePostMealTime', '14:00')}
              {renderTimeInput('randomTime', 'glucoseRandomTime', '20:00')}
            </View>
          ) : null}

          <SettingRow 
             label={t('settings.waterReminders')}
             subtitle={t('settings.waterRemindersSubtitle')}
             value={settings.waterRemindersEnabled}
             onValueChange={(value) => updateBooleanSetting('waterRemindersEnabled', value)}
          />
          {settings.waterRemindersEnabled ? (
            <View className="mb-0 mt-4">
              {renderNotificationNumberInput('timesPerDay', 'waterReminderCount', '7')}
              {renderTimeInput('startTime', 'waterReminderStartTime', '08:00')}
              {renderTimeInput('endTime', 'waterReminderEndTime', '22:00')}
            </View>
          ) : null}
        </Card>

        <Card className="mb-5 p-5">
          {renderCardTitle(t('settings.darkMode'))}
          <SettingRow 
             label={t('settings.darkMode')}
             subtitle={t('settings.appearance')}
             value={isDarkMode}
             onValueChange={(value) => setColorScheme(value ? 'dark' : 'light')}
          />
        </Card>

        <View className="h-6" />
      </ScrollView>

      {/* Fixed Save Button */}
      <View className="px-6 pt-4 pb-6 border-t border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-950">
        <TouchableOpacity 
          onPress={handleSave}
          className="bg-primary rounded-2xl py-5 flex-row items-center justify-center shadow-lg shadow-blue-500/30"
          activeOpacity={0.8}
        >
          <Save size={20} color="white" className="mr-3" />
          <Typography variant="h3" className="text-white ml-2">{t('settings.save')}</Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  textInput: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  }
});

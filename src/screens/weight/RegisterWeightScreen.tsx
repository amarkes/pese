import React from 'react';
import { View, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from 'nativewind';
import { Typography } from '@/components/atoms/Typography';
import { useWeightRegistration } from './hooks/useWeightRegistration';
import { WeightInputCard } from './components/WeightInputCard';
import { DateTimeSelectors } from './components/DateTimeSelectors';
import { TrendIndicator } from './components/TrendIndicator';

export const RegisterWeightScreen: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const {
    weight,
    setWeight,
    date,
    setDate,
    showDatePicker,
    setShowDatePicker,
    showTimePicker,
    setShowTimePicker,
    handleSave,
    weightDiff,
    hasDiff,
    formatDateLabel,
    formatTimeLabel,
    inputRef,
    t,
    navigation
  } = useWeightRegistration();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 justify-between">
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
        >
          <ChevronLeft size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold">{t('weight.registerTitle')}</Typography>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="flex-1 px-6"
          contentContainerClassName="pb-24"
        >
          <Typography variant="label" className="text-center text-text-secondary dark:text-text-secondary-dark my-6 tracking-widest uppercase">
            {t('weight.todayWeight')}
          </Typography>

          <WeightInputCard 
             weight={weight}
             setWeight={setWeight}
             isDarkMode={isDarkMode}
             inputRef={inputRef}
          />

          <DateTimeSelectors 
            onPressDate={() => {
              setShowDatePicker(true);
              setShowTimePicker(false);
            }}
            onPressTime={() => {
              setShowTimePicker(true);
              setShowDatePicker(false);
            }}
            dateLabel={formatDateLabel(date)}
            timeLabel={formatTimeLabel(date)}
            isDarkMode={isDarkMode}
          />

          {/* DateTimePicker modals */}
          {showDatePicker && (
            Platform.OS === 'ios' ? (
              <Modal transparent animationType="slide" visible={showDatePicker}>
                <View className="flex-1 justify-end bg-black/40">
                  <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-12">
                    <View className="flex-row justify-between mb-4">
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Typography className="text-blue-500 font-outfit-semibold">{t('common.cancel')}</Typography>
                      </TouchableOpacity>
                      <Typography className="font-outfit-bold text-slate-800 dark:text-white">
                        {t('weight.selectDate') || 'Selecionar Data'}
                      </Typography>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Typography className="text-blue-500 font-outfit-bold">{t('common.done')}</Typography>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="inline"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setDate(selectedDate);
                      }}
                    />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )
          )}

          {showTimePicker && (
            Platform.OS === 'ios' ? (
              <Modal transparent animationType="slide" visible={showTimePicker}>
                <View className="flex-1 justify-end bg-black/40">
                  <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-12">
                    <View className="flex-row justify-between mb-4">
                      <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                        <Typography className="text-blue-500 font-outfit-semibold">{t('common.cancel')}</Typography>
                      </TouchableOpacity>
                      <Typography className="font-outfit-bold text-slate-800 dark:text-white">
                        {t('weight.selectTime') || 'Selecionar Hora'}
                      </Typography>
                      <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                        <Typography className="text-blue-500 font-outfit-bold">{t('common.done')}</Typography>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={date}
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={(event, selectedDate) => {
                        if (selectedDate) {
                          const newDate = new Date(date);
                          newDate.setHours(selectedDate.getHours());
                          newDate.setMinutes(selectedDate.getMinutes());
                          setDate(newDate);
                        }
                      }}
                    />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={date}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) {
                    const newDate = new Date(date);
                    newDate.setHours(selectedDate.getHours());
                    newDate.setMinutes(selectedDate.getMinutes());
                    setDate(newDate);
                  }
                }}
              />
            )
          )}

          <TrendIndicator 
            hasDiff={hasDiff}
            weightDiff={weightDiff}
            diffLabel={t('weight.lastRecordDiff', { diff: weightDiff > 0 ? `+${weightDiff.toFixed(1)}` : weightDiff.toFixed(1) })}
          />

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave}
            disabled={!weight}
            className={`rounded-3xl py-5 flex-row items-center justify-center shadow-lg ${weight ? 'bg-primary shadow-blue-500/30' : 'bg-slate-200 dark:bg-slate-800 shadow-none'}`}
            activeOpacity={0.8}
          >
            <CheckCircle2 size={24} color="white" strokeWidth={2.5} />
            <Typography variant="h3" className="text-white ml-3">{t('weight.saveRecord')}</Typography>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

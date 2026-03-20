import React from 'react';
import { Platform, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useGlucoseRegistration } from './hooks/useGlucoseRegistration';
import { GlucoseHeader } from './components/GlucoseHeader';
import { MeasurementTypeSelector } from './components/MeasurementTypeSelector';
import { GlucoseInput } from './components/GlucoseInput';
import { GlucoseAlertBox } from './components/GlucoseAlertBox';
import { ObservationsInput } from './components/ObservationsInput';
import { DateTimePickerRow } from './components/DateTimePickerRow';
import { OrientationsModal } from './components/OrientationsModal';
import { SaveButton } from './components/SaveButton';

export const RegisterGlucoseScreen: React.FC = () => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const {
    glucose,
    setGlucose,
    measurementType,
    setMeasurementType,
    observations,
    setObservations,
    date,
    setDate,
    showTimePicker,
    setShowTimePicker,
    showOrientations,
    setShowOrientations,
    handleSave,
    formatDateLabel,
    inputRef,
    t,
    i18n,
    navigation,
  } = useGlucoseRegistration();

  const glucoseNum = parseFloat(glucose.replace(',', '.'));
  const hasValue = !isNaN(glucoseNum) && glucoseNum > 0;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      <GlucoseHeader
        title={t('glucose.registerTitle')}
        isDarkMode={isDarkMode}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 px-6"
          contentContainerClassName="py-6 pb-24"
        >
          <MeasurementTypeSelector
            measurementType={measurementType}
            setMeasurementType={setMeasurementType}
            t={t}
          />

          <GlucoseInput
            glucose={glucose}
            setGlucose={setGlucose}
            isDarkMode={isDarkMode}
            inputRef={inputRef}
            t={t}
          />

          <GlucoseAlertBox
            glucoseNum={glucoseNum}
            isDarkMode={isDarkMode}
            onShowOrientations={() => setShowOrientations(true)}
            t={t}
          />

          <DateTimePickerRow
            date={date}
            setDate={setDate}
            showTimePicker={showTimePicker}
            setShowTimePicker={setShowTimePicker}
            isDarkMode={isDarkMode}
            formatDateLabel={formatDateLabel}
            t={t}
            i18n={i18n}
          />

          <ObservationsInput
            observations={observations}
            setObservations={setObservations}
            isDarkMode={isDarkMode}
            t={t}
          />
        </ScrollView>

        <View className="px-6 pb-6 pt-2 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
          <SaveButton
            onSave={handleSave}
            hasValue={hasValue}
            isDarkMode={isDarkMode}
            t={t}
          />
        </View>
      </KeyboardAvoidingView>

      <OrientationsModal
        visible={showOrientations}
        onClose={() => setShowOrientations(false)}
        t={t}
      />
    </SafeAreaView>
  );
};

import React from 'react';
import { View, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2, Clock, AlertTriangle, ArrowRight, Save, Info } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from 'nativewind';
import { Typography } from '@/components/atoms/Typography';
import { useGlucoseRegistration } from './hooks/useGlucoseRegistration';

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
    navigation
  } = useGlucoseRegistration();

  const glucoseNum = parseFloat(glucose.replace(',', '.'));
  const hasValue = !isNaN(glucoseNum) && glucoseNum > 0;

  const renderMeasurementType = () => {
    const types = [
      { id: 'fasting', label: t('glucose.fasting') },
      { id: 'preMeal', label: t('glucose.preMeal') },
      { id: 'postMeal', label: t('glucose.postMeal') },
      { id: 'random', label: t('glucose.random') },
    ];

    return (
      <View className="mb-6">
        <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white mb-3">
          {t('glucose.measurementType')}
        </Typography>
        <View className="flex-row flex-wrap gap-2">
          {types.map((type) => {
            const isSelected = measurementType === type.id;
            return (
              <TouchableOpacity
                key={type.id}
                onPress={() => setMeasurementType(type.id as any)}
                className={`py-3 px-4 rounded-xl flex-1 min-w-[45%] items-center justify-center flex-row ${
                  isSelected 
                    ? 'bg-blue-600' 
                    : 'bg-slate-100 dark:bg-slate-800'
                }`}
              >
                {isSelected && <CheckCircle2 size={16} color="white" className="absolute left-3" />}
                <Typography 
                  className={`font-outfit-semibold ml-2 ${
                    isSelected ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {type.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 justify-between border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
        >
          <ChevronLeft size={24} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold text-slate-900 dark:text-white">
          {t('glucose.registerTitle')}
        </Typography>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          className="flex-1 px-6"
          contentContainerClassName="py-6 pb-24"
        >
          {renderMeasurementType()}

          {/* Valor da Glicemia */}
          <View className="mb-6">
            <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white mb-3">
              {t('glucose.glucoseValue')}
            </Typography>
            <View className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 h-20 px-6 flex-row items-center">
              <TextInput
                ref={inputRef}
                value={glucose}
                onChangeText={setGlucose}
                keyboardType="numeric"
                className="flex-1 text-center text-4xl font-outfit-bold text-slate-900 dark:text-white"
                placeholder="000"
                placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
                maxLength={4}
              />
              <Typography className="text-slate-400 font-outfit-medium text-lg absolute right-6">
                mg/dL
              </Typography>
            </View>
          </View>

          {/* Alert / Orientation Box */}
          {(() => {
            const getOrientationState = (val: number) => {
              if (isNaN(val) || val <= 0) return 'default';
              if (val <= 80) return 'low';
              if (val <= 92) return 'normal';
              if (val <= 150) return 'pre';
              return 'risky';
            };

            const state = getOrientationState(glucoseNum);

            const getColors = () => {
              switch (state) {
                case 'low':
                  return {
                    bg: 'bg-blue-50 dark:bg-blue-950/30',
                    border: 'border-blue-100 dark:border-blue-900/50',
                    title: 'text-blue-700 dark:text-blue-500',
                    msg: 'text-blue-800/80 dark:text-blue-400/80',
                    icon: '#3B82F6',
                    link: 'text-blue-700 dark:text-blue-500',
                    linkIcon: isDarkMode ? '#60A5FA' : '#1D4ED8'
                  };
                case 'normal':
                  return {
                    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                    border: 'border-emerald-100 dark:border-emerald-900/50',
                    title: 'text-emerald-700 dark:text-emerald-500',
                    msg: 'text-emerald-800/80 dark:text-emerald-400/80',
                    icon: '#10B981',
                    link: 'text-emerald-700 dark:text-emerald-500',
                    linkIcon: isDarkMode ? '#34D399' : '#047857'
                  };
                case 'pre':
                  return {
                    bg: 'bg-orange-50 dark:bg-orange-950/30',
                    border: 'border-orange-100 dark:border-orange-900/50',
                    title: 'text-orange-700 dark:text-orange-500',
                    msg: 'text-orange-800/80 dark:text-orange-400/80',
                    icon: '#EA580C',
                    link: 'text-orange-700 dark:text-orange-500',
                    linkIcon: isDarkMode ? '#F97316' : '#C2410C'
                  };
                case 'risky':
                  return {
                    bg: 'bg-red-50 dark:bg-red-950/30',
                    border: 'border-red-100 dark:border-red-900/50',
                    title: 'text-red-700 dark:text-red-500',
                    msg: 'text-red-800/80 dark:text-red-400/80',
                    icon: '#EF4444',
                    link: 'text-red-700 dark:text-red-500',
                    linkIcon: isDarkMode ? '#F87171' : '#B91C1C'
                  };
                default:
                  return {
                    bg: 'bg-slate-50 dark:bg-slate-900',
                    border: 'border-slate-200 dark:border-slate-800',
                    title: 'text-slate-700 dark:text-slate-300',
                    msg: 'text-slate-600 dark:text-slate-400',
                    icon: '#64748B',
                    link: 'text-blue-600 dark:text-blue-500',
                    linkIcon: isDarkMode ? '#60A5FA' : '#2563EB'
                  };
              }
            };

            const getContent = () => {
              switch (state) {
                case 'low': return { title: t('glucose.msgLowTitle'), desc: t('glucose.msgLow') };
                case 'normal': return { title: t('glucose.msgNormalTitle'), desc: t('glucose.msgNormal') };
                case 'pre': return { title: t('glucose.msgPreTitle'), desc: t('glucose.msgPre') };
                case 'risky': return { title: t('glucose.msgRiskyTitle'), desc: t('glucose.msgRisky') };
                default: return { title: t('glucose.msgDefaultTitle'), desc: t('glucose.msgDefault') };
              }
            };

            const colors = getColors();
            const content = getContent();

            return (
              <View className={`${colors.bg} border ${colors.border} rounded-2xl p-4 mb-6`}>
                <View className="flex-row items-center mb-2">
                  {state === 'normal' ? (
                    <CheckCircle2 size={20} color={colors.icon} />
                  ) : state === 'default' ? (
                    <Info size={20} color={colors.icon} />
                  ) : (
                    <AlertTriangle size={20} color={colors.icon} />
                  )}
                  <Typography className={`font-outfit-bold ml-2 ${colors.title}`}>
                    {content.title}
                  </Typography>
                </View>
                <Typography className={`font-outfit mb-3 ${colors.msg}`}>
                  {content.desc}
                </Typography>
                <TouchableOpacity 
                  onPress={() => setShowOrientations(true)}
                  className="flex-row items-center justify-end"
                >
                  <Typography className={`font-outfit-bold mr-1 ${colors.link}`}>
                    {t('glucose.orientations')}
                  </Typography>
                  <ArrowRight size={16} color={colors.linkIcon} />
                </TouchableOpacity>
              </View>
            );
          })()}

          {/* Observações */}
          <View className="mb-6">
            <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white mb-3">
              {t('glucose.observations')}
            </Typography>
            <TextInput
              value={observations}
              onChangeText={setObservations}
              multiline
              numberOfLines={4}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 min-h-[100px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-outfit"
              placeholder={t('glucose.observationsPlaceholder')}
              placeholderTextColor={isDarkMode ? '#475569' : '#94A3B8'}
              textAlignVertical="top"
            />
          </View>

          {/* Horário e Data */}
          <TouchableOpacity 
            onPress={() => setShowTimePicker(true)}
            className="flex-row items-center justify-between border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 mb-8"
          >
            <View className="flex-row items-center">
              <Clock size={20} color={isDarkMode ? "#64748B" : "#94A3B8"} className="mr-3" />
              <Typography className="font-outfit-semibold text-slate-700 dark:text-slate-300">
                {t('glucose.measurementTime')}
              </Typography>
            </View>
            <Typography className="text-blue-600 dark:text-blue-500 font-outfit-bold">
              {formatDateLabel(date)}
            </Typography>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity 
            onPress={handleSave}
            disabled={!hasValue}
            className={`rounded-2xl flex-row items-center justify-center p-4 mb-6 ${
              hasValue 
                ? 'bg-blue-600 shadow-lg shadow-blue-500/30' 
                : 'bg-slate-200 dark:bg-slate-800 shadow-none'
            }`}
          >
            <Save size={20} color={hasValue ? "white" : (isDarkMode ? "#475569" : "#94A3B8")} />
            <Typography className={`font-outfit-bold text-lg ml-2 ${
              hasValue ? 'text-white' : 'text-slate-400 dark:text-slate-500'
            }`}>
              {t('glucose.saveRecord')}
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Orientations Modal */}
      <Modal visible={showOrientations} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-white dark:bg-slate-900 rounded-3xl w-full p-6 shadow-2xl">
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center px-3 py-1">
                <Info size={24} color="#3B82F6" />
                <Typography className="ml-4 font-outfit-bold text-xl text-slate-900 dark:text-white">
                  {t('glucose.orientationsTitle')}
                </Typography>
              </View>
            </View>

            <View className="space-y-4 mb-8">
              <View className="border-l-4 border-blue-400 pl-4 py-1">
                <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                  {t('glucose.rangeLow')}
                </Typography>
              </View>
              <View className="border-l-4 border-green-400 pl-4 py-1">
                <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                  {t('glucose.rangeNormal')}
                </Typography>
              </View>
              <View className="border-l-4 border-orange-400 pl-4 py-1">
                <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                  {t('glucose.rangePreDiabetic')}
                </Typography>
              </View>
              <View className="border-l-4 border-red-500 pl-4 py-1">
                <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                  {t('glucose.rangeRisky')}
                </Typography>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => setShowOrientations(false)}
              className="bg-blue-600 rounded-xl py-4 items-center"
            >
              <Typography className="text-white font-outfit-bold text-lg">
                {t('common.done')}
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DateTime Picker Modal */}
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
                    {t('glucose.selectTime')}
                  </Typography>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Typography className="text-blue-500 font-outfit-bold">{t('common.done')}</Typography>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={date}
                  mode="datetime"
                  display="spinner"
                  locale={i18n.language}
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
            mode="datetime"
            display="default"
            locale={i18n.language}
            onChange={(event, selectedDate) => {
              setShowTimePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )
      )}
    </SafeAreaView>
  );
};

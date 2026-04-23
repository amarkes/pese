import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CheckCircle2, Heart } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import {
  BloodPressureStorage,
  BloodPressureRecord,
  classifyBP,
} from '@/services/BloodPressureStorage';

const CAT_COLORS: Record<string, string> = {
  low: '#60A5FA',
  normal: '#10B981',
  elevated: '#84CC16',
  hyp1: '#F59E0B',
  hyp2: '#F97316',
  crisis: '#EF4444',
};

export const RegisterBloodPressureScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const isEdit = route.params?.editMode === true;
  const recordId: string | undefined = route.params?.recordId;

  const [systolic, setSystolic] = useState(route.params?.systolic ?? '');
  const [diastolic, setDiastolic] = useState(route.params?.diastolic ?? '');
  const [pulse, setPulse] = useState(route.params?.pulse ?? '');
  const [date, setDate] = useState<Date>(
    route.params?.date ? new Date(route.params.date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [lastRecord, setLastRecord] = useState<BloodPressureRecord | null>(null);

  const diastolicRef = useRef<TextInput>(null);
  const pulseRef = useRef<TextInput>(null);

  useEffect(() => {
    BloodPressureStorage.getLastRecord().then(r => {
      if (r && r.id !== recordId) setLastRecord(r);
    });
  }, [recordId]);

  const formatDateLabel = (d: Date) =>
    d.toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' });

  const formatTimeLabel = (d: Date) =>
    d.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit', hour12: false });

  const canSave = systolic.trim() !== '' && diastolic.trim() !== '';
  const sysNum = parseInt(systolic, 10);
  const diaNum = parseInt(diastolic, 10);
  const category = canSave && !isNaN(sysNum) && !isNaN(diaNum)
    ? classifyBP(sysNum, diaNum)
    : null;
  const catColor = category ? CAT_COLORS[category] : '#64748B';
  const catLabel = category ? t(`bloodPressure.cat${category.charAt(0).toUpperCase() + category.slice(1)}`) : '';

  const handleSave = async () => {
    if (!canSave) return;
    const record = {
      systolic: parseInt(systolic, 10),
      diastolic: parseInt(diastolic, 10),
      pulse: pulse.trim() ? parseInt(pulse, 10) : undefined,
      date: date.toISOString(),
    };
    if (isEdit && recordId) {
      await BloodPressureStorage.updateRecord(recordId, record);
    } else {
      await BloodPressureStorage.saveRecord(record);
    }
    navigation.goBack();
  };

  const inputClass = `text-2xl font-outfit-bold text-center ${isDark ? 'text-white' : 'text-slate-800'}`;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
        >
          <ChevronLeft size={24} color={isDark ? '#60A5FA' : '#3B82F6'} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold">
          {t('bloodPressure.registerTitle')}
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
          contentContainerClassName="pb-24"
        >
          {/* Inputs card */}
          <Card className="mb-4 p-6">
            <View className="flex-row gap-4 mb-4">
              {/* Systolic */}
              <View className="flex-1 items-center">
                <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-2">
                  {t('bloodPressure.systolic')}
                </Typography>
                <TextInput
                  value={systolic}
                  onChangeText={setSystolic}
                  placeholder={t('bloodPressure.systolicPlaceholder')}
                  placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  maxLength={3}
                  onSubmitEditing={() => diastolicRef.current?.focus()}
                  className={inputClass}
                  style={styles.bigInput}
                />
                <Typography className="text-xs font-outfit text-slate-400 mt-1">
                  {t('bloodPressure.mmhg')}
                </Typography>
              </View>

              {/* Divider */}
              <View className="justify-center pb-4">
                <Typography className="text-3xl font-outfit-bold text-slate-300 dark:text-slate-600">
                  /
                </Typography>
              </View>

              {/* Diastolic */}
              <View className="flex-1 items-center">
                <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-2">
                  {t('bloodPressure.diastolic')}
                </Typography>
                <TextInput
                  ref={diastolicRef}
                  value={diastolic}
                  onChangeText={setDiastolic}
                  placeholder={t('bloodPressure.diastolicPlaceholder')}
                  placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  maxLength={3}
                  onSubmitEditing={() => pulseRef.current?.focus()}
                  className={inputClass}
                  style={styles.bigInput}
                />
                <Typography className="text-xs font-outfit text-slate-400 mt-1">
                  {t('bloodPressure.mmhg')}
                </Typography>
              </View>
            </View>

            {/* Pulse */}
            <View className="items-center">
              <Typography className="text-xs font-outfit-bold text-slate-400 uppercase mb-2">
                {t('bloodPressure.pulse')}
              </Typography>
              <TextInput
                ref={pulseRef}
                value={pulse}
                onChangeText={setPulse}
                placeholder={t('bloodPressure.pulsePlaceholder')}
                placeholderTextColor={isDark ? '#475569' : '#94A3B8'}
                keyboardType="number-pad"
                maxLength={3}
                className={`text-lg font-outfit text-center ${isDark ? 'text-white' : 'text-slate-700'}`}
                style={styles.pulseInput}
              />
            </View>

            {/* Classification badge */}
            {category && (
              <View
                className="mt-4 py-2 px-4 rounded-2xl self-center"
                style={{ backgroundColor: `${catColor}20` }}
              >
                <Typography className="text-sm font-outfit-bold" style={{ color: catColor }}>
                  {catLabel}
                </Typography>
              </View>
            )}
          </Card>

          {/* Date / Time */}
          <Card className="mb-4 p-4">
            <TouchableOpacity
              onPress={() => { setShowDatePicker(true); setShowTimePicker(false); }}
              className="flex-row items-center justify-between py-2"
            >
              <Typography className="text-sm font-outfit text-slate-500 dark:text-slate-400">
                {t('bloodPressure.date')}
              </Typography>
              <Typography className="text-sm font-outfit-bold text-slate-800 dark:text-white">
                {formatDateLabel(date)}
              </Typography>
            </TouchableOpacity>
            <View className="h-px bg-slate-100 dark:bg-slate-800" />
            <TouchableOpacity
              onPress={() => { setShowTimePicker(true); setShowDatePicker(false); }}
              className="flex-row items-center justify-between py-2"
            >
              <Typography className="text-sm font-outfit text-slate-500 dark:text-slate-400">
                {t('bloodPressure.time')}
              </Typography>
              <Typography className="text-sm font-outfit-bold text-slate-800 dark:text-white">
                {formatTimeLabel(date)}
              </Typography>
            </TouchableOpacity>
          </Card>

          {/* Date picker modals */}
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
                        {t('bloodPressure.selectDate')}
                      </Typography>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Typography className="text-blue-500 font-outfit-bold">{t('common.done')}</Typography>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker value={date} mode="date" display="inline" locale={i18n.language}
                      onChange={(_, d) => { if (d) setDate(d); }} />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker value={date} mode="date" display="default" locale={i18n.language}
                onChange={(_, d) => { setShowDatePicker(false); if (d) setDate(d); }} />
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
                        {t('bloodPressure.selectTime')}
                      </Typography>
                      <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                        <Typography className="text-blue-500 font-outfit-bold">{t('common.done')}</Typography>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker value={date} mode="time" is24Hour display="spinner" locale={i18n.language}
                      onChange={(_, d) => {
                        if (d) {
                          const nd = new Date(date);
                          nd.setHours(d.getHours(), d.getMinutes());
                          setDate(nd);
                        }
                      }} />
                  </View>
                </View>
              </Modal>
            ) : (
              <DateTimePicker value={date} mode="time" is24Hour display="default" locale={i18n.language}
                onChange={(_, d) => {
                  setShowTimePicker(false);
                  if (d) {
                    const nd = new Date(date);
                    nd.setHours(d.getHours(), d.getMinutes());
                    setDate(nd);
                  }
                }} />
            )
          )}

          {/* Last record */}
          {lastRecord && (
            <View className="flex-row items-center justify-center mb-4 gap-2">
              <Heart size={14} color="#94A3B8" />
              <Typography className="text-xs font-outfit text-slate-400">
                {t('bloodPressure.lastRecord', {
                  systolic: lastRecord.systolic,
                  diastolic: lastRecord.diastolic,
                })}
              </Typography>
            </View>
          )}

          {/* Save button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={!canSave}
            className={`rounded-3xl py-5 flex-row items-center justify-center ${
              canSave ? 'bg-rose-500' : 'bg-slate-200 dark:bg-slate-800'
            }`}
            activeOpacity={0.8}
          >
            <CheckCircle2 size={24} color="white" strokeWidth={2.5} />
            <Typography variant="h3" className="text-white ml-3">
              {t('bloodPressure.saveRecord')}
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bigInput: { width: '100%', fontSize: 40, lineHeight: 48 },
  pulseInput: { width: 100 },
});

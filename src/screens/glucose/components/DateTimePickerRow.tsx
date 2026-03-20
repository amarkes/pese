import React from 'react';
import { View, TouchableOpacity, Modal, Platform } from 'react-native';
import { Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Typography } from '@/components/atoms/Typography';
import { TFunction } from 'i18next';
import { i18n as I18nInstance } from 'i18next';

interface DateTimePickerRowProps {
  date: Date;
  setDate: (date: Date) => void;
  showTimePicker: boolean;
  setShowTimePicker: (value: boolean) => void;
  isDarkMode: boolean;
  formatDateLabel: (date: Date) => string;
  t: TFunction;
  i18n: I18nInstance;
}

export const DateTimePickerRow: React.FC<DateTimePickerRowProps> = ({
  date,
  setDate,
  showTimePicker,
  setShowTimePicker,
  isDarkMode,
  formatDateLabel,
  t,
  i18n,
}) => (
  <>
    <TouchableOpacity
      onPress={() => setShowTimePicker(true)}
      className="flex-row items-center justify-between border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 mb-8"
    >
      <View className="flex-row items-center">
        <Clock size={20} color={isDarkMode ? '#64748B' : '#94A3B8'} className="mr-4" />
        <Typography className="ml-2 font-outfit-semibold text-slate-700 dark:text-slate-300">
          {t('glucose.measurementTime')}
        </Typography>
      </View>
      <Typography className="text-blue-600 dark:text-blue-500 font-outfit-bold">
        {formatDateLabel(date)}
      </Typography>
    </TouchableOpacity>

    {showTimePicker &&
      (Platform.OS === 'ios' ? (
        <Modal transparent animationType="slide" visible={showTimePicker}>
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-12">
              <View className="flex-row justify-between mb-4">
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Typography className="text-blue-500 font-outfit-semibold">
                    {t('common.cancel')}
                  </Typography>
                </TouchableOpacity>
                <Typography className="font-outfit-bold text-slate-800 dark:text-white">
                  {t('glucose.selectTime')}
                </Typography>
                <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                  <Typography className="text-blue-500 font-outfit-bold">
                    {t('common.done')}
                  </Typography>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="datetime"
                display="spinner"
                locale={i18n.language}
                onChange={(_, selectedDate) => {
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
          onChange={(_, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      ))}
  </>
);

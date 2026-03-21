import { useState, useRef, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { GlucoseStorage, MeasurementType } from '@/services/GlucoseStorage';
import { LocalNotificationService } from '@/services/LocalNotificationService';

export const useGlucoseRegistration = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const inputRef = useRef<TextInput>(null);

  const [glucose, setGlucose] = useState('');
  const [measurementType, setMeasurementType] = useState<MeasurementType>('fasting');
  const [observations, setObservations] = useState('');
  const [date, setDate] = useState(new Date());
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showOrientations, setShowOrientations] = useState(false);

  // Edit Mode state
  const isEditing = route.params?.editMode;
  const recordId = route.params?.recordId;

  useFocusEffect(
    useCallback(() => {
      if (isEditing) {
        setGlucose(route.params.glucose?.toString() || '');
        setMeasurementType(route.params.measurementType || 'fasting');
        setObservations(route.params.observations || '');
        if (route.params.date) {
            setDate(new Date(route.params.date));
        }
      } else {
        setGlucose('');
        setMeasurementType('fasting');
        setObservations('');
        setDate(new Date());
      }
      
      setShowDatePicker(false);
      setShowTimePicker(false);
      setShowOrientations(false);
      
      return () => {};
    }, [isEditing, route.params])
  );

  const handleSave = async () => {
    const glucoseNum = parseFloat(glucose.replace(',', '.'));
    if (!isNaN(glucoseNum) && glucoseNum > 0) {
      if (isEditing && recordId) {
        await GlucoseStorage.updateRecord(recordId, glucoseNum, measurementType, observations, date.toISOString());
      } else {
        await GlucoseStorage.saveRecord(glucoseNum, measurementType, observations, date.toISOString());
      }

      try {
        await LocalNotificationService.syncConfiguredReminders(t, i18n.language);
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to refresh local notifications after glucose save:', error);
        }
      }

      navigation.goBack();
    }
  };

  const formatDateLabel = (d: Date) => {
    const today = new Date();
    const isToday = d.getDate() === today.getDate() && 
                    d.getMonth() === today.getMonth() && 
                    d.getFullYear() === today.getFullYear();
    
    const formattedDate = d.toLocaleDateString(i18n.language, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const formattedTime = d.toLocaleTimeString(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    if (isToday) {
      return `${t('common.today')}, ${formattedTime}`;
    }
    return `${formattedDate}, ${formattedTime}`;
  };

  return {
    glucose,
    setGlucose,
    measurementType,
    setMeasurementType,
    observations,
    setObservations,
    date,
    setDate,
    showDatePicker,
    setShowDatePicker,
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
  };
};

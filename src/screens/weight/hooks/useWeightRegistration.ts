import { useState, useRef, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { WeightStorage, WeightRecord } from '@/services/WeightStorage';

export const useWeightRegistration = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const inputRef = useRef<TextInput>(null);

  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [lastRecord, setLastRecord] = useState<WeightRecord | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Edit Mode state
  const isEditing = route.params?.editMode;
  const recordId = route.params?.recordId;

  useFocusEffect(
    useCallback(() => {
      if (isEditing) {
        setWeight(route.params.weight || '');
        setDate(new Date(route.params.date));
      } else {
        setWeight('');
        setDate(new Date());
      }
      
      setShowDatePicker(false);
      setShowTimePicker(false);
      loadLastRecord();
      
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      return () => clearTimeout(timer);
    }, [isEditing, route.params])
  );

  const loadLastRecord = async () => {
    const last = await WeightStorage.getLastRecord();
    setLastRecord(last);
  };

  const handleSave = async () => {
    const weightNum = parseFloat(weight.replace(',', '.'));
    if (!isNaN(weightNum) && weightNum > 0) {
      if (isEditing && recordId) {
        await WeightStorage.updateRecord(recordId, weightNum, date.toISOString());
      } else {
        await WeightStorage.saveRecord(weightNum, date.toISOString());
      }
      navigation.goBack();
    }
  };

  const weightNum = parseFloat(weight.replace(',', '.')) || 0;
  const weightDiff = lastRecord ? weightNum - lastRecord.weight : 0;
  const hasDiff = !!(lastRecord && weight !== '' && !isNaN(weightNum));

  const formatDateLabel = (d: Date) => {
    const today = new Date();
    const isToday = d.getDate() === today.getDate() && 
                    d.getMonth() === today.getMonth() && 
                    d.getFullYear() === today.getFullYear();
    
    const formatted = d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    return isToday ? `${t('common.today')}, ${formatted}` : formatted;
  };

  const formatTimeLabel = (d: Date) => {
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  };

  return {
    weight,
    setWeight,
    date,
    setDate,
    lastRecord,
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
    i18n,
    navigation
  };
};

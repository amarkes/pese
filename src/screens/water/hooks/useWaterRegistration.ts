import { useState, useCallback, useRef } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { WaterStorage, WaterRecord } from '@/services/WaterStorage';
import { WeightStorage } from '@/services/WeightStorage';

export const useWaterRegistration = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const inputRef = useRef<TextInput>(null);

  const [manualAmount, setManualAmount] = useState('');
  const [todayRecords, setTodayRecords] = useState<WaterRecord[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2500);

  const loadData = useCallback(async () => {
    try {
      const weights = await WeightStorage.getRecords();
      const latestWeight = weights[0]?.weight || 75;
      setDailyGoal(Math.round(latestWeight * 35));

      const today = new Date().toISOString();
      const records = await WaterStorage.getRecordsByDate(today);
      setTodayRecords(records);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleAddWater = async (amount: number) => {
    if (amount > 0) {
      await WaterStorage.saveRecord(amount, new Date().toISOString());
      loadData();
    }
  };

  const handleUpdateWater = async (id: string, newAmount: number) => {
    const r = todayRecords.find(record => record.id === id);
    if(r) {
      await WaterStorage.updateRecord(id, newAmount, r.date);
      loadData();
    }
  }

  const handleManualAdd = async () => {
    const amount = parseInt(manualAmount, 10);
    if (!isNaN(amount) && amount > 0) {
      await handleAddWater(amount);
      setManualAmount('');
      inputRef.current?.blur();
    }
  };

  const handleDelete = async (id: string) => {
    await WaterStorage.deleteRecord(id);
    loadData();
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const totalConsumed = todayRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const percentage = Math.min(Math.round((totalConsumed / dailyGoal) * 100), 100);

  return {
    manualAmount,
    setManualAmount,
    todayRecords,
    dailyGoal,
    totalConsumed,
    percentage,
    handleAddWater,
    handleManualAdd,
    handleDelete,
    handleUpdateWater,
    formatTime,
    inputRef,
    t,
    navigation
  };
};

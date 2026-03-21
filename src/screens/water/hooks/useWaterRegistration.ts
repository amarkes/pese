import { useState, useCallback, useRef } from 'react';
import { TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { WaterStorage, WaterRecord } from '@/services/WaterStorage';
import { SettingsStorage } from '@/services/SettingsStorage';
import { WeightStorage } from '@/services/WeightStorage';
import { LocalNotificationService } from '@/services/LocalNotificationService';

const getRecommendedWaterGoal = (currentWeight: number | null, weightGoal: string) => {
  const baseWeight =
    currentWeight ??
    parseFloat(weightGoal.replace(',', '.'));

  if (!isNaN(baseWeight) && baseWeight > 0) {
    return Math.round(baseWeight * 35);
  }

  return 2500;
};

export const useWaterRegistration = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const inputRef = useRef<TextInput>(null);

  const [manualAmount, setManualAmount] = useState('');
  const [todayRecords, setTodayRecords] = useState<WaterRecord[]>([]);
  const [dailyGoal, setDailyGoal] = useState(2500);
  const [quickAdds, setQuickAdds] = useState<number[]>([200, 300, 500]);

  const loadData = useCallback(async () => {
    try {
      const [settings, lastWeightRecord] = await Promise.all([
        SettingsStorage.getSettings(),
        WeightStorage.getLastRecord(),
      ]);

      const configuredGoal = parseInt(settings.waterGoal, 10);
      const recommendedGoal = getRecommendedWaterGoal(
        lastWeightRecord?.weight ?? null,
        settings.weightGoal
      );

      setDailyGoal(configuredGoal > 0 ? configuredGoal : recommendedGoal);
      const savedQuickAdds = settings.waterQuickAdds || ['200', '300', '500'];
      setQuickAdds(savedQuickAdds.map(val => parseInt(val, 10) || 0).filter(val => val > 0));

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
      try {
        await LocalNotificationService.syncConfiguredReminders(t, i18n.language);
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to refresh local notifications after water save:', error);
        }
      }
      loadData();
    }
  };

  const handleUpdateWater = async (id: string, newAmount: number) => {
    const r = todayRecords.find(record => record.id === id);
    if(r) {
      await WaterStorage.updateRecord(id, newAmount, r.date);
      try {
        await LocalNotificationService.syncConfiguredReminders(t, i18n.language);
      } catch (error) {
        if (__DEV__) {
          console.warn('Failed to refresh local notifications after water update:', error);
        }
      }
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
    try {
      await LocalNotificationService.syncConfiguredReminders(t, i18n.language);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to refresh local notifications after water delete:', error);
      }
    }
    loadData();
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' });
  };

  const totalConsumed = todayRecords.reduce((acc, curr) => acc + curr.amount, 0);
  const percentage = Math.min(Math.round((totalConsumed / dailyGoal) * 100), 100);

  return {
    manualAmount,
    setManualAmount,
    todayRecords,
    dailyGoal,
    quickAdds,
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

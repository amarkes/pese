import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { WeightStorage } from '@/services/WeightStorage';

export type HistoryItemType = 'weight' | 'glucose' | 'water' | 'sleep';

export interface HistoryRecord {
  id: string;
  type: HistoryItemType;
  value: number;
  valueDisplay: string;
  unit: string;
  date: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  subtitle?: string;
  status?: string;
  originalId: string;
}

export type PeriodType = 'day' | 'week' | 'month' | 'custom';

export const useHistory = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<HistoryItemType | 'all'>('all');
  const [period, setPeriod] = useState<PeriodType>('month');
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<HistoryRecord | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const weights = await WeightStorage.getRecords();
      
      const weightRecords: HistoryRecord[] = weights.map((w, idx) => {
        // Simple trend calculation for demo
        const prevWeight = weights[idx + 1]?.weight;
        const diff = prevWeight ? w.weight - prevWeight : 0;
        
        return {
          id: `w-${w.id}`,
          originalId: w.id,
          type: 'weight',
          value: w.weight,
          valueDisplay: `${w.weight.toFixed(1)}`,
          unit: 'kg',
          date: w.date,
          subtitle: t('history.weightSub'),
          trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
          trendValue: diff !== 0 ? `${Math.abs(diff).toFixed(1)}kg` : undefined
        };
      });

      const getGlucoseStatus = (value: number) => {
        if (value >= 70 && value <= 95) return t('history.glucoseNormal');
        if (value >= 96 && value <= 125) return t('history.glucosePreDiabetic');
        if (value > 125) return t('history.glucoseDiabetic');
        return t('history.glucoseNormal');
      };

      const getWaterStatus = (value: number, unit: string) => {
        const latestWeight = weights[0]?.weight || 75; // Using 75 as fallback
        const dayGoal = latestWeight * 35; // Standard crazy calculation
        const mlValue = unit === 'L' ? value * 1000 : value;
        const percentage = (mlValue / dayGoal) * 100;
        
        if (percentage >= 100) return t('history.dailyGoalMet');
        if (percentage >= 80) return t('history.waterGood');
        if (percentage >= 40) return t('history.waterFair');
        return t('history.waterLow');
      };

      // Mocks for others (glucose, water, sleep) as requested until we have their screens
      const mocks: HistoryRecord[] = [
        {
          id: 'mock-g1',
          originalId: 'g1',
          type: 'glucose',
          value: 98,
          valueDisplay: '98',
          unit: 'mg/dL',
          date: new Date().toISOString(),
          subtitle: `${t('history.glucoseSub')} • ${t('history.afterMeal')}`,
          status: getGlucoseStatus(98)
        },
        {
          id: 'mock-a1',
          originalId: 'a1',
          type: 'water',
          value: 500,
          valueDisplay: '500',
          unit: 'ml',
          date: new Date().toISOString(),
          subtitle: t('history.waterSub'),
          status: getWaterStatus(500, 'ml')
        },
        {
          id: 'mock-a2',
          originalId: 'a2',
          type: 'water',
          value: 2.5,
          valueDisplay: '2.5',
          unit: 'L',
          date: new Date(Date.now() - 86400000).toISOString(),
          subtitle: `${t('history.waterSub')} • ${t('history.totalDay')}`,
          status: getWaterStatus(2.5, 'L')
        }
      ];

      setRecords([...weightRecords, ...mocks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const filteredRecords = useMemo(() => {
    return records.filter(r => activeFilter === 'all' || r.type === activeFilter);
  }, [records, activeFilter]);

  const groupedRecords = useMemo(() => {
    const groups: { [key: string]: HistoryRecord[] } = {};
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    filteredRecords.forEach(record => {
      const d = new Date(record.date);
      let groupKey = '';
      
      const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      const isYesterday = d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear();
      const fullDate = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }).toUpperCase();

      if (isToday) {
        groupKey = `${t('history.today')}, ${fullDate}`;
      } else if (isYesterday) {
        groupKey = `${t('history.yesterday')}, ${fullDate}`;
      } else {
        groupKey = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(record);
    });

    return Object.keys(groups).map(key => ({
      title: key,
      data: groups[key]
    }));
  }, [filteredRecords, t]);

  const handleDelete = async (record: HistoryRecord) => {
    if (record.type === 'weight') {
      await WeightStorage.deleteRecord(record.originalId);
      loadData();
    }
    setItemToDelete(null);
  };

  return {
    groupedRecords,
    activeFilter,
    setActiveFilter,
    period,
    setPeriod,
    loading,
    showPeriodModal,
    setShowPeriodModal,
    itemToDelete,
    setItemToDelete,
    handleDelete,
    loadData
  };
};

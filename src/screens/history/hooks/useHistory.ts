import { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { WeightStorage } from '@/services/WeightStorage';
import { GlucoseStorage } from '@/services/GlucoseStorage';
import { WaterStorage } from '@/services/WaterStorage';

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
  measurementType?: string;
  observations?: string;
}

export type PeriodType = 'day' | 'week' | 'month' | 'custom';

export const useHistory = () => {
  const { t, i18n } = useTranslation();
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
        if (value <= 80) return t('glucose.msgLowTitle');
        if (value <= 92) return t('glucose.msgNormalTitle');
        if (value <= 150) return t('glucose.msgPreTitle');
        return t('glucose.msgRiskyTitle');
      };

      const glucose = await GlucoseStorage.getRecords();
      
      const glucoseRecords: HistoryRecord[] = glucose.map((g) => {
        return {
          id: `g-${g.id}`,
          originalId: g.id,
          type: 'glucose',
          value: g.glucose,
          valueDisplay: `${g.glucose}`,
          unit: 'mg/dL',
          date: g.date,
          subtitle: `${t('history.glucoseSub')} • ${t(`glucose.${g.measurementType}`)}`,
          status: getGlucoseStatus(g.glucose),
          measurementType: g.measurementType,
          observations: g.observations
        };
      });

      const waters = await WaterStorage.getRecords();

      const waterRecords: HistoryRecord[] = waters.map((w) => ({
        id: `water-${w.id}`,
        originalId: w.id,
        type: 'water',
        value: w.amount,
        valueDisplay: `${w.amount}`,
        unit: 'ml',
        date: w.date,
        subtitle: t('history.waterSub'),
      }));

      setRecords([...weightRecords, ...glucoseRecords, ...waterRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
      const fullDate = d.toLocaleDateString(i18n.language, {
        day: '2-digit',
        month: 'long',
      }).toUpperCase();

      if (isToday) {
        groupKey = `${t('history.today')}, ${fullDate}`;
      } else if (isYesterday) {
        groupKey = `${t('history.yesterday')}, ${fullDate}`;
      } else {
        groupKey = d.toLocaleDateString(i18n.language, {
          month: 'long',
          year: 'numeric',
        }).toUpperCase();
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(record);
    });

    return Object.keys(groups).map(key => ({
      title: key,
      data: groups[key]
    }));
  }, [filteredRecords, i18n.language, t]);

  const handleDelete = async (record: HistoryRecord) => {
    if (record.type === 'weight') {
      await WeightStorage.deleteRecord(record.originalId);
    } else if (record.type === 'glucose') {
      await GlucoseStorage.deleteRecord(record.originalId);
    } else if (record.type === 'water') {
      await WaterStorage.deleteRecord(record.originalId);
    }
    setItemToDelete(null);
    loadData();
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

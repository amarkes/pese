import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@blood_pressure_records';

export interface BloodPressureRecord {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  date: string;
}

export type BPCategory = 'low' | 'normal' | 'elevated' | 'hyp1' | 'hyp2' | 'crisis';

export function classifyBP(systolic: number, diastolic: number): BPCategory {
  if (systolic < 90 || diastolic < 60) return 'low';
  if (systolic >= 180 || diastolic >= 120) return 'crisis';
  if (systolic >= 140 || diastolic >= 90) return 'hyp2';
  if (systolic >= 130 || diastolic >= 80) return 'hyp1';
  if (systolic >= 120 && diastolic < 80) return 'elevated';
  return 'normal';
}

export function isHealthyBP(systolic: number, diastolic: number): boolean {
  const cat = classifyBP(systolic, diastolic);
  return cat === 'normal';
}

export const BloodPressureStorage = {
  getRecords: async (): Promise<BloodPressureRecord[]> => {
    try {
      const json = await AsyncStorage.getItem(KEY);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  },

  saveRecord: async (record: Omit<BloodPressureRecord, 'id'>): Promise<BloodPressureRecord> => {
    const records = await BloodPressureStorage.getRecords();
    const newRecord: BloodPressureRecord = { ...record, id: Date.now().toString() };
    records.push(newRecord);
    await AsyncStorage.setItem(KEY, JSON.stringify(records));
    return newRecord;
  },

  updateRecord: async (id: string, updates: Partial<Omit<BloodPressureRecord, 'id'>>): Promise<void> => {
    const records = await BloodPressureStorage.getRecords();
    const idx = records.findIndex(r => r.id === id);
    if (idx !== -1) {
      records[idx] = { ...records[idx], ...updates };
      await AsyncStorage.setItem(KEY, JSON.stringify(records));
    }
  },

  deleteRecord: async (id: string): Promise<void> => {
    const records = await BloodPressureStorage.getRecords();
    await AsyncStorage.setItem(KEY, JSON.stringify(records.filter(r => r.id !== id)));
  },

  getLastRecord: async (): Promise<BloodPressureRecord | null> => {
    const records = await BloodPressureStorage.getRecords();
    if (!records.length) return null;
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  },
};

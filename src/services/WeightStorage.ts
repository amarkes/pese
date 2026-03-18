import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WeightRecord {
  id: string;
  weight: number;
  date: string; // ISO string
}

const STORAGE_KEYS = {
  WEIGHTS: '@pese/weights',
};

export const WeightStorage = {
  async saveRecord(weight: number, date: string = new Date().toISOString()): Promise<WeightRecord> {
    try {
      const records = await this.getRecords();
      const newRecord: WeightRecord = {
        id: Math.random().toString(36).substring(7),
        weight,
        date,
      };
      
      const updatedRecords = [newRecord, ...records];
      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(updatedRecords));
      return newRecord;
    } catch (e) {
      console.error('Error saving weight record:', e);
      throw e;
    }
  },

  async getRecords(): Promise<WeightRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error getting weight records:', e);
      return [];
    }
  },

  async getLastRecord(): Promise<WeightRecord | null> {
    const records = await this.getRecords();
    return records.length > 0 ? records[0] : null;
  },
};

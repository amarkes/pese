import AsyncStorage from '@react-native-async-storage/async-storage';

export type MeasurementType = 'fasting' | 'preMeal' | 'postMeal' | 'random';

export interface GlucoseRecord {
  id: string;
  glucose: number;
  measurementType: MeasurementType;
  observations: string;
  date: string; // ISO string
}

const STORAGE_KEYS = {
  GLUCOSE: '@pese/glucose',
};

export const GlucoseStorage = {
  async saveRecord(
    glucose: number,
    measurementType: MeasurementType,
    observations: string,
    date: string = new Date().toISOString()
  ): Promise<GlucoseRecord> {
    try {
      const records = await this.getRecords();
      const newRecord: GlucoseRecord = {
        id: Math.random().toString(36).substring(7),
        glucose,
        measurementType,
        observations,
        date,
      };

      const updatedRecords = [newRecord, ...records];
      await AsyncStorage.setItem(STORAGE_KEYS.GLUCOSE, JSON.stringify(updatedRecords));
      return newRecord;
    } catch (e) {
      console.error('Error saving glucose record:', e);
      throw e;
    }
  },

  async getRecords(): Promise<GlucoseRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.GLUCOSE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error getting glucose records:', e);
      return [];
    }
  },

  async getLastRecord(): Promise<GlucoseRecord | null> {
    const records = await this.getRecords();
    return records.length > 0 ? records[0] : null;
  },

  async deleteRecord(id: string): Promise<void> {
    try {
      const records = await this.getRecords();
      const updatedRecords = records.filter(r => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.GLUCOSE, JSON.stringify(updatedRecords));
    } catch (e) {
      console.error('Error deleting glucose record:', e);
      throw e;
    }
  },

  async updateRecord(id: string, glucose: number, measurementType: MeasurementType, observations: string, date: string): Promise<void> {
    try {
      const records = await this.getRecords();
      const index = records.findIndex(r => r.id === id);
      if (index !== -1) {
        records[index] = { ...records[index], glucose, measurementType, observations, date };
        await AsyncStorage.setItem(STORAGE_KEYS.GLUCOSE, JSON.stringify(records));
      }
    } catch (e) {
      console.error('Error updating glucose record:', e);
      throw e;
    }
  },
};

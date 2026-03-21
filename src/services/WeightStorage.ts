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

  async deleteRecord(id: string): Promise<void> {
    try {
      const records = await this.getRecords();
      const updatedRecords = records.filter(r => r.id !== id);
      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(updatedRecords));
    } catch (e) {
      console.error('Error deleting weight record:', e);
      throw e;
    }
  },

  async updateRecord(id: string, weight: number, date: string): Promise<void> {
    try {
      const records = await this.getRecords();
      const index = records.findIndex(r => r.id === id);
      if (index !== -1) {
        records[index] = { ...records[index], weight, date };
        await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(records));
      }
    } catch (e) {
      console.error('Error updating weight record:', e);
      throw e;
    }
  },

  async importRecords(recordsToImport: Array<Omit<WeightRecord, 'id'>>): Promise<number> {
    if (recordsToImport.length === 0) {
      return 0;
    }

    try {
      const records = await this.getRecords();
      const importedRecords: WeightRecord[] = recordsToImport.map((record, index) => ({
        id: `weight-import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        ...record,
      }));

      const updatedRecords = [...importedRecords, ...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      await AsyncStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(updatedRecords));
      return importedRecords.length;
    } catch (e) {
      console.error('Error importing weight records:', e);
      throw e;
    }
  },
};

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WaterRecord {
  id: string;
  amount: number; // in ml
  date: string; // ISO string
}

const WATER_STORAGE_KEY = '@pese_water_records';

export const WaterStorage = {
  saveRecord: async (amount: number, date: string): Promise<WaterRecord> => {
    try {
      const records = await WaterStorage.getRecords();
      const newRecord: WaterRecord = {
        id: Date.now().toString(),
        amount,
        date,
      };
      
      const updatedRecords = [newRecord, ...records];
      await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(updatedRecords));
      
      return newRecord;
    } catch (error) {
      console.error('Error saving water record:', error);
      throw error;
    }
  },

  getRecords: async (): Promise<WaterRecord[]> => {
    try {
      const recordsJson = await AsyncStorage.getItem(WATER_STORAGE_KEY);
      if (!recordsJson) return [];
      
      const records: WaterRecord[] = JSON.parse(recordsJson);
      return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting water records:', error);
      return [];
    }
  },

  getRecordsByDate: async (dateString: string): Promise<WaterRecord[]> => {
    try {
      const records = await WaterStorage.getRecords();
      const targetDate = new Date(dateString);
      
      return records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getDate() === targetDate.getDate() &&
               recordDate.getMonth() === targetDate.getMonth() &&
               recordDate.getFullYear() === targetDate.getFullYear();
      });
    } catch (error) {
      console.error('Error getting water records by date:', error);
      return [];
    }
  },

  updateRecord: async (id: string, amount: number, date: string): Promise<void> => {
    try {
      const records = await WaterStorage.getRecords();
      const index = records.findIndex(r => r.id === id);
      
      if (index !== -1) {
        records[index] = { ...records[index], amount, date };
        await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(records));
      }
    } catch (error) {
      console.error('Error updating water record:', error);
      throw error;
    }
  },

  deleteRecord: async (id: string): Promise<void> => {
    try {
      const records = await WaterStorage.getRecords();
      const filteredRecords = records.filter(r => r.id !== id);
      await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(filteredRecords));
    } catch (error) {
      console.error('Error deleting water record:', error);
      throw error;
    }
  },

  importRecords: async (recordsToImport: Array<Omit<WaterRecord, 'id'>>): Promise<number> => {
    if (recordsToImport.length === 0) {
      return 0;
    }

    try {
      const records = await WaterStorage.getRecords();
      const importedRecords: WaterRecord[] = recordsToImport.map((record, index) => ({
        id: `water-import-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        ...record,
      }));

      const updatedRecords = [...importedRecords, ...records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(updatedRecords));
      return importedRecords.length;
    } catch (error) {
      console.error('Error importing water records:', error);
      throw error;
    }
  },
};

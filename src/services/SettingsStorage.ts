import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  weightGoal: string;
  birthDate: string;
  height: string;
  glucoseLowMin: string;
  glucoseLowMax: string;
  glucoseNormalMin: string;
  glucoseNormalMax: string;
  glucosePreMin: string;
  glucosePreMax: string;
  glucoseRiskyMin: string;
  glucoseRiskyMax: string;
  waterGoal: string;
  waterQuickAdds: string[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  weightGoal: '75',
  birthDate: '',
  height: '170',
  glucoseLowMin: '36',
  glucoseLowMax: '80',
  glucoseNormalMin: '81',
  glucoseNormalMax: '92',
  glucosePreMin: '93',
  glucosePreMax: '150',
  glucoseRiskyMin: '151',
  glucoseRiskyMax: '600',
  waterGoal: '2500',
  waterQuickAdds: ['200', '300', '500']
};

const SETTINGS_STORAGE_KEY = '@pese_app_settings';

export const SettingsStorage = {
  getSettings: async (): Promise<AppSettings> => {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!settingsJson) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settingsJson) };
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: async (settings: AppSettings): Promise<void> => {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
};

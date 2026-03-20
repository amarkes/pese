import { Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { AppSettings, SettingsStorage, DEFAULT_SETTINGS } from '@/services/SettingsStorage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { LocalNotificationService } from '@/services/LocalNotificationService';

type StringSettingKey = {
  [K in keyof AppSettings]: AppSettings[K] extends string ? K : never;
}[keyof AppSettings];

type BooleanSettingKey = {
  [K in keyof AppSettings]: AppSettings[K] extends boolean ? K : never;
}[keyof AppSettings];

export const useSettings = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const timeKeys: StringSettingKey[] = [
    'weightReminderTime',
    'glucoseFastingTime',
    'glucosePreMealTime',
    'glucosePostMealTime',
    'glucoseRandomTime',
    'waterReminderStartTime',
    'waterReminderEndTime',
  ];

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [notificationWarning, setNotificationWarning] = useState<string | null>(null);
  
  useEffect(() => {
    (async () => {
      const data = await SettingsStorage.getSettings();
      setSettings(data);
      setNotificationWarning(
        LocalNotificationService.isModuleAvailable()
          ? null
          : t('settings.notificationsUnavailableMessage')
      );
    })();
  }, [t]);

  const updateSetting = (key: StringSettingKey, value: string) => {
    let finalValue = value;
    
    if (key === 'birthDate') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) {
        finalValue = numbers;
      } else if (numbers.length <= 4) {
        finalValue = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
      } else {
        finalValue = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
      }
    } else if (timeKeys.includes(key)) {
      const numbers = value.replace(/\D/g, '').slice(0, 4);
      if (numbers.length <= 2) {
        finalValue = numbers;
      } else {
        finalValue = `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
      }
    }
    
    setSettings(prev => ({ ...prev, [key]: finalValue }));
  };

  const updateBooleanSetting = (key: BooleanSettingKey, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateWaterQuickAdd = (index: number, value: string) => {
    setSettings(prev => {
      const newArray = [...(prev.waterQuickAdds || ['200', '300', '500'])];
      newArray[index] = value;
      return { ...prev, waterQuickAdds: newArray };
    });
  };

  const addWaterQuickAdd = () => {
    setSettings(prev => {
      const newArray = [...(prev.waterQuickAdds || ['200', '300', '500']), ''];
      return { ...prev, waterQuickAdds: newArray };
    });
  };

  const removeWaterQuickAdd = (indexToRemove: number) => {
    setSettings(prev => {
      const currentArray = prev.waterQuickAdds || ['200', '300', '500'];
      const newArray = currentArray.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, waterQuickAdds: newArray };
    });
  };

  const handleSave = async () => {
    let nextSettings = settings;
    const validationErrors = LocalNotificationService.validateSettings(settings);

    if (validationErrors.length > 0) {
      const messages = validationErrors.map((error) => {
        switch (error) {
          case 'weight_time':
            return t('settings.invalidWeightTime');
          case 'glucose_fasting_time':
            return t('settings.invalidGlucoseFastingTime');
          case 'glucose_pre_meal_time':
            return t('settings.invalidGlucosePreMealTime');
          case 'glucose_post_meal_time':
            return t('settings.invalidGlucosePostMealTime');
          case 'glucose_random_time':
            return t('settings.invalidGlucoseRandomTime');
          case 'water_count':
            return t('settings.invalidWaterCount');
          case 'water_window':
            return t('settings.invalidWaterWindow');
        }
      });

      Alert.alert(
        t('settings.invalidNotificationsTitle'),
        messages.join('\n')
      );
      return;
    }

    const reminders = LocalNotificationService.buildReminders(settings, {
      weightTitle: t('settings.weightReminderTitle'),
      weightBody: t('settings.weightReminderBody'),
      glucoseFastingTitle: t('settings.glucoseFastingReminderTitle'),
      glucoseFastingBody: t('settings.glucoseFastingReminderBody'),
      glucosePreMealTitle: t('settings.glucosePreMealReminderTitle'),
      glucosePreMealBody: t('settings.glucosePreMealReminderBody'),
      glucosePostMealTitle: t('settings.glucosePostMealReminderTitle'),
      glucosePostMealBody: t('settings.glucosePostMealReminderBody'),
      glucoseRandomTitle: t('settings.glucoseRandomReminderTitle'),
      glucoseRandomBody: t('settings.glucoseRandomReminderBody'),
      waterTitle: t('settings.waterReminderTitle'),
      waterBody: t('settings.waterReminderBody'),
    });

    if (reminders.length > 0 && !LocalNotificationService.isModuleAvailable()) {
      setNotificationWarning(t('settings.notificationsUnavailableMessage'));
      await SettingsStorage.saveSettings(nextSettings);
      navigation.goBack();
      return;
    }

    try {
      const result = await LocalNotificationService.syncReminders(reminders);

      if (!result.granted) {
        setNotificationWarning(t('settings.notificationsPermissionDeniedMessage'));
      } else {
        setNotificationWarning(
          LocalNotificationService.isModuleAvailable()
            ? null
            : t('settings.notificationsUnavailableMessage')
        );
      }
    } catch (error) {
      setNotificationWarning(t('settings.notificationsUnavailableMessage'));
      if (__DEV__) {
        console.warn('Failed to sync local notifications:', error);
      }
    }

    await SettingsStorage.saveSettings(nextSettings);
    navigation.goBack();
  };

  const calculateRecommendedWater = () => {
    const weight = parseFloat(settings.weightGoal.replace(',', '.'));
    if (!isNaN(weight) && weight > 0) {
      return Math.round(weight * 35).toLocaleString('pt-BR');
    }
    return '2.500'; // fallback
  };

  return {
    settings,
    updateSetting,
    updateBooleanSetting,
    updateWaterQuickAdd,
    addWaterQuickAdd,
    removeWaterQuickAdd,
    handleSave,
    calculateRecommendedWater,
    notificationWarning,
    t,
    navigation
  };
};

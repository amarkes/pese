import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { AppSettings } from './SettingsStorage';

export interface ReminderSpec {
  id: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
}

export type NotificationValidationError =
  | 'weight_time'
  | 'glucose_fasting_time'
  | 'glucose_pre_meal_time'
  | 'glucose_post_meal_time'
  | 'glucose_random_time'
  | 'water_count'
  | 'water_window';

interface NotificationTexts {
  weightTitle: string;
  weightBody: string;
  glucoseFastingTitle: string;
  glucoseFastingBody: string;
  glucosePreMealTitle: string;
  glucosePreMealBody: string;
  glucosePostMealTitle: string;
  glucosePostMealBody: string;
  glucoseRandomTitle: string;
  glucoseRandomBody: string;
  waterTitle: string;
  waterBody: string;
}

interface LocalNotificationNativeModule {
  requestPermission?: () => Promise<boolean>;
  scheduleReminders: (reminders: ReminderSpec[]) => Promise<void>;
  cancelAllReminders: () => Promise<void>;
}

const { LocalNotificationModule } = NativeModules as {
  LocalNotificationModule?: LocalNotificationNativeModule;
};

const getNativeModule = () => {
  if (!LocalNotificationModule) {
    throw new Error('LocalNotificationModule is not available');
  }

  return LocalNotificationModule;
};

const requestAndroidPermission = async () => {
  if (Platform.Version < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const requestPermission = async () => {
  if (Platform.OS === 'android') {
    return requestAndroidPermission();
  }

  if (Platform.OS === 'ios') {
    const nativeModule = getNativeModule();
    if (!nativeModule.requestPermission) {
      return false;
    }

    return nativeModule.requestPermission();
  }

  return false;
};

const parseTime = (value: string) => {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return { hour, minute };
};

const toMinutes = (value: { hour: number; minute: number }) =>
  value.hour * 60 + value.minute;

const buildWaterTimes = (count: number, startMinutes: number, endMinutes: number) => {
  if (count <= 1) {
    return [{ hour: Math.floor(startMinutes / 60), minute: startMinutes % 60 }];
  }

  const interval = (endMinutes - startMinutes) / (count - 1);

  return Array.from({ length: count }, (_, index) => {
    const totalMinutes = Math.round(startMinutes + interval * index);
    return {
      hour: Math.floor(totalMinutes / 60),
      minute: totalMinutes % 60,
    };
  });
};

export const LocalNotificationService = {
  isModuleAvailable() {
    return !!LocalNotificationModule;
  },

  validateSettings(settings: AppSettings): NotificationValidationError[] {
    const errors: NotificationValidationError[] = [];

    if (settings.weightReminderEnabled && !parseTime(settings.weightReminderTime)) {
      errors.push('weight_time');
    }

    if (settings.glucoseRemindersEnabled) {
      if (!parseTime(settings.glucoseFastingTime)) {
        errors.push('glucose_fasting_time');
      }
      if (!parseTime(settings.glucosePreMealTime)) {
        errors.push('glucose_pre_meal_time');
      }
      if (!parseTime(settings.glucosePostMealTime)) {
        errors.push('glucose_post_meal_time');
      }
      if (!parseTime(settings.glucoseRandomTime)) {
        errors.push('glucose_random_time');
      }
    }

    if (settings.waterRemindersEnabled) {
      const count = parseInt(settings.waterReminderCount, 10);
      const start = parseTime(settings.waterReminderStartTime);
      const end = parseTime(settings.waterReminderEndTime);

      if (!Number.isInteger(count) || count <= 0) {
        errors.push('water_count');
      }

      if (!start || !end || toMinutes(end) <= toMinutes(start)) {
        errors.push('water_window');
      }
    }

    return errors;
  },

  buildReminders(settings: AppSettings, texts: NotificationTexts): ReminderSpec[] {
    const reminders: ReminderSpec[] = [];

    if (settings.weightReminderEnabled) {
      const time = parseTime(settings.weightReminderTime);
      if (time) {
        reminders.push({
          id: 'weight-daily',
          title: texts.weightTitle,
          body: texts.weightBody,
          hour: time.hour,
          minute: time.minute,
        });
      }
    }

    if (settings.glucoseRemindersEnabled) {
      const glucoseReminders: Array<[string, string, string, string]> = [
        ['glucose-fasting', settings.glucoseFastingTime, texts.glucoseFastingTitle, texts.glucoseFastingBody],
        ['glucose-pre-meal', settings.glucosePreMealTime, texts.glucosePreMealTitle, texts.glucosePreMealBody],
        ['glucose-post-meal', settings.glucosePostMealTime, texts.glucosePostMealTitle, texts.glucosePostMealBody],
        ['glucose-random', settings.glucoseRandomTime, texts.glucoseRandomTitle, texts.glucoseRandomBody],
      ];

      glucoseReminders.forEach(([id, rawTime, title, body]) => {
        const time = parseTime(rawTime);
        if (time) {
          reminders.push({
            id,
            title,
            body,
            hour: time.hour,
            minute: time.minute,
          });
        }
      });
    }

    if (settings.waterRemindersEnabled) {
      const count = parseInt(settings.waterReminderCount, 10);
      const start = parseTime(settings.waterReminderStartTime);
      const end = parseTime(settings.waterReminderEndTime);

      if (Number.isInteger(count) && count > 0 && start && end) {
        const times = buildWaterTimes(count, toMinutes(start), toMinutes(end));

        times.forEach((time, index) => {
          reminders.push({
            id: `water-${index + 1}`,
            title: texts.waterTitle,
            body: texts.waterBody,
            hour: time.hour,
            minute: time.minute,
          });
        });
      }
    }

    return reminders;
  },

  async syncReminders(reminders: ReminderSpec[]) {
    if (reminders.length === 0) {
      if (!LocalNotificationModule) {
        return { granted: true };
      }

      const nativeModule = getNativeModule();
      await nativeModule.cancelAllReminders();
      return { granted: true };
    }

    const nativeModule = getNativeModule();

    const granted = await requestPermission();

    if (!granted) {
      await nativeModule.cancelAllReminders();
      return { granted: false };
    }

    await nativeModule.scheduleReminders(reminders);
    return { granted: true };
  },
};

import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { AppSettings, SettingsStorage } from './SettingsStorage';
import { GlucoseStorage, MeasurementType } from './GlucoseStorage';
import { WaterStorage } from './WaterStorage';
import { WeightStorage } from './WeightStorage';
import { BloodPressureStorage } from './BloodPressureStorage';

export interface ReminderSpec {
  id: string;
  title: string;
  body: string;
  hour: number;
  minute: number;
  sound: string;
}

export interface NotificationSoundOption {
  id: string;
  name: string;
}

export type NotificationValidationError =
  | 'weight_time'
  | 'glucose_fasting_time'
  | 'glucose_pre_meal_time'
  | 'glucose_post_meal_time'
  | 'glucose_random_time'
  | 'water_count'
  | 'water_window'
  | 'bp_morning_time'
  | 'bp_night_time';

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
  bpMorningTitle: string;
  bpMorningBody: string;
  bpNightTitle: string;
  bpNightBody: string;
}

type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

interface LocalNotificationNativeModule {
  requestPermission?: () => Promise<boolean>;
  scheduleReminders: (reminders: ReminderSpec[]) => Promise<void>;
  cancelAllReminders: () => Promise<void>;
  getAvailableSounds?: () => Promise<NotificationSoundOption[]>;
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

const DEFAULT_SOUND_ID = 'default';
const SILENT_SOUND_ID = 'silent';

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

const getRecommendedWaterGoal = (currentWeight: number | null, weightGoal: string) => {
  const baseWeight =
    currentWeight ??
    parseFloat(weightGoal.replace(',', '.'));

  if (!isNaN(baseWeight) && baseWeight > 0) {
    return Math.round(baseWeight * 35);
  }

  return 2500;
};

const formatWeight = (value: number, locale: string) =>
  value.toLocaleString(locale, {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
    maximumFractionDigits: 1,
  });

const formatInteger = (value: number, locale: string) => value.toLocaleString(locale);

const getLatestGlucoseByType = async () => {
  const records = await GlucoseStorage.getRecords();

  return records.reduce<Partial<Record<MeasurementType, number>>>((acc, record) => {
    if (acc[record.measurementType] == null) {
      acc[record.measurementType] = record.glucose;
    }

    return acc;
  }, {});
};

const buildNotificationTexts = async (
  settings: AppSettings,
  t: TranslateFn,
  locale: string
): Promise<NotificationTexts> => {
  const [lastWeightRecord, latestGlucoseByType, todayWaterRecords, lastBpRecord] = await Promise.all([
    WeightStorage.getLastRecord(),
    getLatestGlucoseByType(),
    WaterStorage.getRecordsByDate(new Date().toISOString()),
    BloodPressureStorage.getLastRecord(),
  ]);

  const dailyGoalSetting = parseInt(settings.waterGoal, 10);
  const dailyGoal =
    dailyGoalSetting > 0
      ? dailyGoalSetting
      : getRecommendedWaterGoal(lastWeightRecord?.weight ?? null, settings.weightGoal);
  const consumedToday = todayWaterRecords.reduce((total, record) => total + record.amount, 0);
  const remainingWater = Math.max(dailyGoal - consumedToday, 0);

  return {
    weightTitle: t('settings.weightReminderTitle'),
    weightBody: lastWeightRecord
      ? t('settings.weightReminderBodyWithLast', { weight: formatWeight(lastWeightRecord.weight, locale) })
      : t('settings.weightReminderBodyWithoutLast'),
    glucoseFastingTitle: t('settings.glucoseFastingReminderTitle'),
    glucoseFastingBody: latestGlucoseByType.fasting != null
      ? t('settings.glucoseFastingReminderBodyWithLast', { value: formatInteger(latestGlucoseByType.fasting, locale) })
      : t('settings.glucoseFastingReminderBodyWithoutLast'),
    glucosePreMealTitle: t('settings.glucosePreMealReminderTitle'),
    glucosePreMealBody: latestGlucoseByType.preMeal != null
      ? t('settings.glucosePreMealReminderBodyWithLast', { value: formatInteger(latestGlucoseByType.preMeal, locale) })
      : t('settings.glucosePreMealReminderBodyWithoutLast'),
    glucosePostMealTitle: t('settings.glucosePostMealReminderTitle'),
    glucosePostMealBody: latestGlucoseByType.postMeal != null
      ? t('settings.glucosePostMealReminderBodyWithLast', { value: formatInteger(latestGlucoseByType.postMeal, locale) })
      : t('settings.glucosePostMealReminderBodyWithoutLast'),
    glucoseRandomTitle: t('settings.glucoseRandomReminderTitle'),
    glucoseRandomBody: latestGlucoseByType.random != null
      ? t('settings.glucoseRandomReminderBodyWithLast', { value: formatInteger(latestGlucoseByType.random, locale) })
      : t('settings.glucoseRandomReminderBodyWithoutLast'),
    waterTitle: t('settings.waterReminderTitle'),
    waterBody: remainingWater > 0
      ? t('settings.waterReminderBodyWithRemaining', {
          remaining: formatInteger(remainingWater, locale),
          goal: formatInteger(dailyGoal, locale),
        })
      : t('settings.waterReminderBodyGoalMet', { goal: formatInteger(dailyGoal, locale) }),
    bpMorningTitle: t('settings.bpMorningReminderTitle'),
    bpMorningBody: lastBpRecord
      ? t('settings.bpMorningReminderBodyWithLast', {
          systolic: formatInteger(lastBpRecord.systolic, locale),
          diastolic: formatInteger(lastBpRecord.diastolic, locale),
        })
      : t('settings.bpMorningReminderBodyWithoutLast'),
    bpNightTitle: t('settings.bpNightReminderTitle'),
    bpNightBody: lastBpRecord
      ? t('settings.bpNightReminderBodyWithLast', {
          systolic: formatInteger(lastBpRecord.systolic, locale),
          diastolic: formatInteger(lastBpRecord.diastolic, locale),
        })
      : t('settings.bpNightReminderBodyWithoutLast'),
  };
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

    if (settings.bpRemindersEnabled) {
      if (!parseTime(settings.bpMorningTime)) {
        errors.push('bp_morning_time');
      }
      if (!parseTime(settings.bpNightTime)) {
        errors.push('bp_night_time');
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
          sound: settings.notificationSound,
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
            sound: settings.notificationSound,
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
            sound: settings.notificationSound,
          });
        });
      }
    }

    if (settings.bpRemindersEnabled) {
      const bpReminders: Array<[string, string, string, string]> = [
        ['bp-morning', settings.bpMorningTime, texts.bpMorningTitle, texts.bpMorningBody],
        ['bp-night', settings.bpNightTime, texts.bpNightTitle, texts.bpNightBody],
      ];

      bpReminders.forEach(([id, rawTime, title, body]) => {
        const time = parseTime(rawTime);
        if (time) {
          reminders.push({
            id,
            title,
            body,
            hour: time.hour,
            minute: time.minute,
            sound: settings.notificationSound,
          });
        }
      });
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

  async getAvailableSounds(t: TranslateFn): Promise<NotificationSoundOption[]> {
    const baseOptions: NotificationSoundOption[] = [
      { id: DEFAULT_SOUND_ID, name: t('settings.notificationSoundDefault') },
      { id: SILENT_SOUND_ID, name: t('settings.notificationSoundSilent') },
    ];

    if (!LocalNotificationModule?.getAvailableSounds) {
      return baseOptions;
    }

    try {
      const nativeSounds = await LocalNotificationModule.getAvailableSounds();
      const seen = new Set(baseOptions.map(option => option.id));
      const uniqueNativeSounds = nativeSounds
        .filter(option => option?.id && option?.name && !seen.has(option.id))
        .sort((a, b) => a.name.localeCompare(b.name));

      return [...baseOptions, ...uniqueNativeSounds];
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to load notification sounds:', error);
      }
      return baseOptions;
    }
  },

  async syncConfiguredReminders(t: TranslateFn, locale: string = 'pt-BR') {
    const settings = await SettingsStorage.getSettings();
    const texts = await buildNotificationTexts(settings, t, locale);
    const reminders = this.buildReminders(settings, texts);

    if (reminders.length === 0) {
      return this.syncReminders([]);
    }

    if (!this.isModuleAvailable()) {
      return { granted: false };
    }

    return this.syncReminders(reminders);
  },
};

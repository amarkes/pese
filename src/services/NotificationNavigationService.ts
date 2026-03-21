import { AppState, Linking, NativeModules } from 'react-native';
import { navigationRef } from '@/navigation/navigationRef';

interface LocalNotificationNavigationModule {
  consumePendingNotificationUrl?: () => Promise<string | null>;
}

const { LocalNotificationModule } = NativeModules as {
  LocalNotificationModule?: LocalNotificationNavigationModule;
};

let unsubscribeAppState: (() => void) | null = null;
let pendingUrl: string | null = null;

const navigateIfPossible = () => {
  if (!pendingUrl || !navigationRef.isReady()) {
    return;
  }

  const url = pendingUrl;
  pendingUrl = null;
  Linking.openURL(url).catch(error => {
    if (__DEV__) {
      console.warn('Failed to open notification deep link:', error);
    }
  });
};

const consumePendingRoute = async () => {
  try {
    const url = await LocalNotificationModule?.consumePendingNotificationUrl?.();
    if (typeof url === 'string' && url.length > 0) {
      pendingUrl = url;
      navigateIfPossible();
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to consume pending notification route:', error);
    }
  }
};

export const NotificationNavigationService = {
  start() {
    if (unsubscribeAppState) {
      return;
    }

    consumePendingRoute().catch(() => undefined);

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        consumePendingRoute().catch(() => undefined);
      }
    });

    unsubscribeAppState = () => {
      subscription.remove();
      unsubscribeAppState = null;
    };
  },

  stop() {
    unsubscribeAppState?.();
  },

  flushPendingNavigation() {
    navigateIfPossible();
  },
};

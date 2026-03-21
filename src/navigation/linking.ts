import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList, TabParamList } from './navigationRef';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['pese://'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: '',
          Reports: 'reports',
          History: 'history',
          Settings: 'settings',
          Add: 'add',
        } satisfies Record<keyof TabParamList, string>,
      },
      RegisterWeight: 'register/weight',
      RegisterGlucose: 'register/glucose',
      RegisterWater: 'register/water',
      AppSettings: 'app-settings',
      DataTransfer: 'data-transfer',
      HelpCenter: 'help',
      PrivacyPolicy: 'privacy-policy',
    },
  },
};

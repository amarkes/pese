import { createNavigationContainerRef, NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Reports: undefined;
  History: undefined;
  Settings: undefined;
  Add: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  RegisterWeight: undefined;
  RegisterGlucose: undefined;
  RegisterWater: undefined;
  AppSettings: undefined;
  DataTransfer: undefined;
  HelpCenter: undefined;
  PrivacyPolicy: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

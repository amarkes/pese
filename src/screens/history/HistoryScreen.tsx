import React from 'react';
import { Typography } from '../../components/atoms/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HistoryScreen: React.FC = () => (
  <SafeAreaView className="flex-1 bg-background items-center justify-center">
    <Typography variant="h2">Histórico</Typography>
  </SafeAreaView>
);

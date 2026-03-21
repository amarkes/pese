import React from 'react';
import { ActivityIndicator, Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Download, FileSpreadsheet, Upload } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { Card } from '@/components/molecules/Card';
import { Typography } from '@/components/atoms/Typography';
import { DataTransferService, TransferDataType } from '@/services/DataTransferService';
import { LocalNotificationService } from '@/services/LocalNotificationService';

type ActionKind = 'import' | 'export' | 'template';

const DataTransferScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [loadingKey, setLoadingKey] = React.useState<string | null>(null);

  const typeLabel = (type: TransferDataType) => t(`common.${type}`);

  const getErrorMessage = (error: unknown) => {
    const code = error instanceof Error ? error.message : 'unknown';

    switch (code) {
      case 'cancelled':
        return null;
      case 'invalid_template':
        return t('transfer.invalidTemplateMessage');
      case 'empty_file':
        return t('transfer.emptyFileMessage');
      case 'no_valid_rows':
        return t('transfer.noValidRowsMessage');
      case 'file_unavailable':
        return t('transfer.fileUnavailableMessage');
      default:
        return t('transfer.genericErrorMessage');
    }
  };

  const handleAction = async (kind: ActionKind, type: TransferDataType) => {
    const actionKey = `${kind}-${type}`;
    setLoadingKey(actionKey);

    try {
      if (kind === 'import') {
        const result = await DataTransferService.importSpreadsheet(type);
        await LocalNotificationService.syncConfiguredReminders(t, i18n.language);

        Alert.alert(
          t('transfer.importSuccessTitle'),
          t('transfer.importSuccessMessage', {
            type: typeLabel(type),
            imported: result.imported,
            skipped: result.skipped,
          })
        );
        return;
      }

      if (kind === 'export') {
        const exported = await DataTransferService.exportSpreadsheet(type);
        Alert.alert(
          t('transfer.exportSuccessTitle'),
          t('transfer.exportSuccessMessage', {
            type: typeLabel(type),
            count: exported,
          })
        );
        return;
      }

      await DataTransferService.downloadTemplate(type);
      Alert.alert(
        t('transfer.templateSuccessTitle'),
        t('transfer.templateSuccessMessage', {
          type: typeLabel(type),
        })
      );
    } catch (error) {
      const message = getErrorMessage(error);
      if (!message) {
        return;
      }

      Alert.alert(t('transfer.errorTitle'), message);
    } finally {
      setLoadingKey(null);
    }
  };

  const renderRow = (
    kind: ActionKind,
    type: TransferDataType,
    titleKey: string,
    subtitleKey: string
  ) => {
    const isLoading = loadingKey === `${kind}-${type}`;
    const Icon = kind === 'import' ? Upload : Download;

    return (
      <TouchableOpacity
        key={`${kind}-${type}`}
        onPress={() => handleAction(kind, type)}
        activeOpacity={0.85}
        className="mb-3"
      >
        <Card className="p-4">
          <View className="flex-row items-center">
            <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/30">
              <FileSpreadsheet size={22} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
            </View>
            <View className="flex-1 pr-4">
              <Typography variant="h3" className="font-outfit-bold text-slate-900 dark:text-white">
                {t(titleKey)}
              </Typography>
              <Typography className="mt-1 font-outfit-medium text-slate-500 dark:text-slate-400">
                {t(subtitleKey)}
              </Typography>
            </View>
            <View className="h-11 min-w-[44px] items-center justify-center rounded-2xl bg-slate-100 px-3 dark:bg-slate-900">
              {isLoading ? (
                <ActivityIndicator color={isDarkMode ? '#60A5FA' : '#2563EB'} />
              ) : (
                <Icon size={18} color={isDarkMode ? '#CBD5E1' : '#475569'} />
              )}
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-950" edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between border-b border-slate-50 px-6 py-4 dark:border-slate-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900"
        >
          <ChevronLeft size={24} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
        </TouchableOpacity>
        <Typography variant="h2" className="text-xl font-outfit-bold text-slate-900 dark:text-white">
          {t('transfer.title')}
        </Typography>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Card className="mb-5 p-5">
          <Typography variant="label" className="mb-3 font-outfit-bold tracking-widest text-primary">
            {t('transfer.infoTitle')}
          </Typography>
          <Typography className="font-outfit-medium text-slate-600 dark:text-slate-300">
            {t('transfer.infoBody')}
          </Typography>
        </Card>

        <Card className="mb-5 p-5">
          <Typography variant="label" className="mb-4 font-outfit-bold tracking-widest text-primary">
            {t('transfer.importSection')}
          </Typography>
          {renderRow('import', 'weight', 'transfer.importWeightTitle', 'transfer.importWeightSubtitle')}
          {renderRow('import', 'glucose', 'transfer.importGlucoseTitle', 'transfer.importGlucoseSubtitle')}
          {renderRow('import', 'water', 'transfer.importWaterTitle', 'transfer.importWaterSubtitle')}
        </Card>

        <Card className="mb-5 p-5">
          <Typography variant="label" className="mb-4 font-outfit-bold tracking-widest text-primary">
            {t('transfer.exportSection')}
          </Typography>
          {renderRow('export', 'weight', 'transfer.exportWeightTitle', 'transfer.exportWeightSubtitle')}
          {renderRow('export', 'glucose', 'transfer.exportGlucoseTitle', 'transfer.exportGlucoseSubtitle')}
          {renderRow('export', 'water', 'transfer.exportWaterTitle', 'transfer.exportWaterSubtitle')}
        </Card>

        <Card className="mb-5 p-5">
          <Typography variant="label" className="mb-4 font-outfit-bold tracking-widest text-primary">
            {t('transfer.templateSection')}
          </Typography>
          {renderRow('template', 'weight', 'transfer.templateWeightTitle', 'transfer.templateWeightSubtitle')}
          {renderRow('template', 'glucose', 'transfer.templateGlucoseTitle', 'transfer.templateGlucoseSubtitle')}
          {renderRow('template', 'water', 'transfer.templateWaterTitle', 'transfer.templateWaterSubtitle')}
        </Card>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DataTransferScreen;

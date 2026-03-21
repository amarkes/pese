import React, { useState } from 'react';
import { TouchableOpacity, View, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { FileText, FileSpreadsheet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { exportPDF, exportCSV, ExportStats } from '@/services/ExportService';

interface ExportActionsProps {
  stats: ExportStats;
  dataIncluded: { weight: boolean; glucose: boolean; water: boolean };
}

export const ExportActions = ({ stats, dataIncluded }: ExportActionsProps) => {
  const { t } = useTranslation();
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);

  const handlePDF = async () => {
    setLoadingPdf(true);
    try {
      await exportPDF({ stats, dataIncluded });
    } catch (e: any) {
      if (!e?.message?.includes('User did not share')) {
        Alert.alert(t('reports.exportErrorTitle'), t('reports.exportPdfError'));
      }
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleCSV = async () => {
    setLoadingCsv(true);
    try {
      await exportCSV({ stats, dataIncluded });
    } catch (e: any) {
      if (!e?.message?.includes('User did not share')) {
        Alert.alert(t('reports.exportErrorTitle'), t('reports.exportCsvError'));
      }
    } finally {
      setLoadingCsv(false);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={handlePDF}
        disabled={loadingPdf}
        className="bg-[#2563EB] rounded-xl flex-row items-center justify-center py-4 mb-3"
        style={loadingPdf ? btnStyles.disabled : btnStyles.active}
      >
        {loadingPdf ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <FileText size={20} color="white" />
            <Typography className="text-white font-outfit-bold ml-2">{t('reports.exportPdf')}</Typography>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCSV}
        disabled={loadingCsv}
        className="bg-[#10B981] rounded-xl flex-row items-center justify-center py-4 mb-10"
        style={loadingCsv ? btnStyles.disabled : btnStyles.active}
      >
        {loadingCsv ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <FileSpreadsheet size={20} color="white" />
            <Typography className="text-white font-outfit-bold ml-2">{t('reports.exportCsv')}</Typography>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const btnStyles = StyleSheet.create({
  active: { opacity: 1 },
  disabled: { opacity: 0.7 },
});

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { FileText, FileSpreadsheet } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export const ExportActions = () => {
  const { t } = useTranslation();

  return (
    <View>
      <TouchableOpacity className="bg-[#2563EB] rounded-xl flex-row items-center justify-center py-4 mb-3">
        <FileText size={20} color="white" />
        <Typography className="text-white font-outfit-bold ml-2">{t('reports.exportPdf')}</Typography>
      </TouchableOpacity>

      <TouchableOpacity className="bg-[#10B981] rounded-xl flex-row items-center justify-center py-4 mb-10">
        <FileSpreadsheet size={20} color="white" />
        <Typography className="text-white font-outfit-bold ml-2">{t('reports.exportCsv')}</Typography>
      </TouchableOpacity>
    </View>
  );
};

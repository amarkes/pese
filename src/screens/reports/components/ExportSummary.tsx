import React from 'react';
import { View } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { Calendar, FileText } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface ExportSummaryProps {
  startDate: string;
  endDate: string;
  totalRecords: number;
}

export const ExportSummary = ({ startDate, endDate, totalRecords }: ExportSummaryProps) => {
  const { t } = useTranslation();

  return (
    <View className="mb-6">
      <View className="bg-[#0F172A] rounded-2xl p-5 shadow-lg">
        <Typography className="font-outfit-bold text-blue-400 text-xs mb-2 uppercase">
          {t('reports.exportSummaryTitle')}
        </Typography>
        <Typography className="font-outfit-bold text-white text-xl mb-4">
          {t('reports.exportSummaryName')}
        </Typography>
        
        <View className="flex-row items-center mb-4">
          <Calendar size={14} color="#94A3B8" />
          <Typography className="text-slate-300 text-sm ml-2 mr-4">
            {startDate} - {endDate}
          </Typography>
          <FileText size={14} color="#94A3B8" />
          <Typography className="text-slate-300 text-sm ml-2">
            {t('reports.records', { count: totalRecords })}
          </Typography>
        </View>
        
        <View className="w-12 h-12 bg-slate-800 rounded-xl items-center justify-center">
          <FileText size={24} color="#F8FAFC" />
        </View>
      </View>
    </View>
  );
};

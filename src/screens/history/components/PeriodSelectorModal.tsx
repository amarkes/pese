import React from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Typography } from '@/components/atoms/Typography';
import { useTranslation } from 'react-i18next';
import { PeriodType } from '../hooks/useHistory';

interface PeriodSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  activePeriod: PeriodType;
  onSelect: (period: PeriodType) => void;
  isDarkMode: boolean;
}

export const PeriodSelectorModal: React.FC<PeriodSelectorModalProps> = ({ 
  visible, onClose, activePeriod, onSelect
}) => {
  const { t } = useTranslation();
  
  const periods: PeriodType[] = ['day', 'week', 'month', 'custom'];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-center px-6">
          <TouchableWithoutFeedback>
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl">
              <Typography variant="h3" className="text-lg font-outfit-bold text-slate-800 dark:text-white mb-6">
                {t('history.periodModalTitle')}
              </Typography>
              
              {periods.map(p => {
                const isActive = activePeriod === p;
                return (
                  <TouchableOpacity 
                    key={p}
                    onPress={() => {
                      onSelect(p);
                      onClose();
                    }}
                    className={`flex-row items-center justify-between p-4 mb-2 rounded-2xl ${isActive ? 'bg-blue-50 dark:bg-slate-800 border border-blue-500' : 'bg-slate-50 dark:bg-slate-800 border border-transparent'}`}
                  >
                    <Typography 
                      variant="body" 
                      className={`font-outfit-bold ${isActive ? 'text-blue-500' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {t(`settings.${p}`) || p.toUpperCase()}
                    </Typography>
                    {isActive && <View className="w-2 h-2 rounded-full bg-blue-500" />}
                  </TouchableOpacity>
                );
              })}
              
              <TouchableOpacity 
                onPress={onClose}
                className="mt-4 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl items-center"
              >
                <Typography variant="h3" className="text-slate-600 dark:text-white font-outfit-bold">
                   {t('common.cancel')}
                </Typography>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

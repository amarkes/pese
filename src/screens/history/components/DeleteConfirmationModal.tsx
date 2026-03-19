import React from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { useTranslation } from 'react-i18next';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDarkMode: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  visible, onClose, onConfirm
}) => {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-center px-6">
          <TouchableWithoutFeedback>
            <View className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl items-center">
              <View className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full items-center justify-center mb-6">
                <Trash2 size={40} color="#F87171" strokeWidth={2.5} />
              </View>

              <Typography variant="h3" className="text-xl font-outfit-bold text-slate-800 dark:text-white mb-2 text-center">
                {t('history.deleteTitle')}
              </Typography>

              <Typography variant="body" className="text-sm font-outfit-medium text-slate-500 dark:text-slate-400 mb-8 text-center px-4 leading-6">
                {t('history.deleteMessage')}
              </Typography>
              
              <View className="flex-row space-x-4">
                <TouchableOpacity 
                  onPress={onClose}
                  className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl items-center"
                >
                  <Typography variant="h3" className="text-slate-600 dark:text-white font-outfit-bold">
                     {t('common.cancel')}
                  </Typography>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={onConfirm}
                  className="flex-1 bg-red-500 py-4 rounded-2xl items-center shadow-lg shadow-red-500/30"
                >
                  <Typography variant="h3" className="text-white font-outfit-bold">
                     {t('history.delete')}
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

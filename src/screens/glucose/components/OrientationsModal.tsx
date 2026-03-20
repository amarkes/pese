import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal } from 'react-native';
import { Info } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { TFunction } from 'i18next';
import { DEFAULT_SETTINGS, SettingsStorage } from '@/services/SettingsStorage';

interface OrientationsModalProps {
  visible: boolean;
  onClose: () => void;
  t: TFunction;
}

export const OrientationsModal: React.FC<OrientationsModalProps> = ({ visible, onClose, t }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    if (!visible) {
      return;
    }

    let isMounted = true;

    const loadSettings = async () => {
      const storedSettings = await SettingsStorage.getSettings();
      if (isMounted) {
        setSettings(storedSettings);
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center p-6">
        <View className="bg-white dark:bg-slate-900 rounded-3xl w-full p-6 shadow-2xl">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center px-3 py-1">
              <Info size={24} color="#3B82F6" />
              <Typography className="ml-4 font-outfit-bold text-xl text-slate-900 dark:text-white">
                {t('glucose.orientationsTitle')}
              </Typography>
            </View>
          </View>

          <View className="space-y-4 mb-8">
            <View className="border-l-4 border-blue-400 pl-4 py-1">
              <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                {t('glucose.rangeLow', {
                  min: settings.glucoseLowMin,
                  max: settings.glucoseLowMax,
                })}
              </Typography>
            </View>
            <View className="border-l-4 border-green-400 pl-4 py-1">
              <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                {t('glucose.rangeNormal', {
                  min: settings.glucoseNormalMin,
                  max: settings.glucoseNormalMax,
                })}
              </Typography>
            </View>
            <View className="border-l-4 border-orange-400 pl-4 py-1">
              <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                {t('glucose.rangePreDiabetic', {
                  min: settings.glucosePreMin,
                  max: settings.glucosePreMax,
                })}
              </Typography>
            </View>
            <View className="border-l-4 border-red-500 pl-4 py-1">
              <Typography className="font-outfit text-slate-700 dark:text-slate-300">
                {t('glucose.rangeRisky', {
                  min: settings.glucoseRiskyMin,
                  max: settings.glucoseRiskyMax,
                })}
              </Typography>
            </View>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="bg-blue-600 rounded-xl py-4 items-center"
          >
            <Typography className="text-white font-outfit-bold text-lg">
              {t('common.done')}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

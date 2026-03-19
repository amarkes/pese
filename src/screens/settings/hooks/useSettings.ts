import { useState, useEffect } from 'react';
import { AppSettings, SettingsStorage, DEFAULT_SETTINGS } from '@/services/SettingsStorage';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export const useSettings = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  
  useEffect(() => {
    (async () => {
      const data = await SettingsStorage.getSettings();
      setSettings(data);
    })();
  }, []);

  const updateSetting = (key: keyof AppSettings, value: string) => {
    let finalValue = value;
    
    if (key === 'birthDate') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 2) {
        finalValue = numbers;
      } else if (numbers.length <= 4) {
        finalValue = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
      } else {
        finalValue = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
      }
    }
    
    setSettings(prev => ({ ...prev, [key]: finalValue }));
  };

  const updateWaterQuickAdd = (index: number, value: string) => {
    setSettings(prev => {
      const newArray = [...(prev.waterQuickAdds || ['200', '300', '500'])];
      newArray[index] = value;
      return { ...prev, waterQuickAdds: newArray };
    });
  };

  const addWaterQuickAdd = () => {
    setSettings(prev => {
      const newArray = [...(prev.waterQuickAdds || ['200', '300', '500']), ''];
      return { ...prev, waterQuickAdds: newArray };
    });
  };

  const removeWaterQuickAdd = (indexToRemove: number) => {
    setSettings(prev => {
      const currentArray = prev.waterQuickAdds || ['200', '300', '500'];
      const newArray = currentArray.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, waterQuickAdds: newArray };
    });
  };

  const handleSave = async () => {
    await SettingsStorage.saveSettings(settings);
    navigation.goBack();
  };

  const calculateRecommendedWater = () => {
    const weight = parseFloat(settings.weightGoal.replace(',', '.'));
    if (!isNaN(weight) && weight > 0) {
      return Math.round(weight * 35).toLocaleString('pt-BR');
    }
    return '2.500'; // fallback
  };

  return {
    settings,
    updateSetting,
    updateWaterQuickAdd,
    addWaterQuickAdd,
    removeWaterQuickAdd,
    handleSave,
    calculateRecommendedWater,
    t,
    navigation
  };
};

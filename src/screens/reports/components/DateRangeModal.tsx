import React, { useState } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from 'react-i18next';
import { Typography } from '@/components/atoms/Typography';
import { Calendar, X, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

interface DateRangeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
}

type PickerField = 'start' | 'end' | null;

export const DateRangeModal = ({ visible, onClose, onConfirm }: DateRangeModalProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [activeField, setActiveField] = useState<PickerField>(null);

  const fmt = (d: Date) =>
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleStartChange = (_: any, date?: Date) => {
    if (Platform.OS === 'android') setActiveField(null);
    if (date) {
      setStartDate(date);
      if (date > endDate) setEndDate(date);
    }
  };

  const handleEndChange = (_: any, date?: Date) => {
    if (Platform.OS === 'android') setActiveField(null);
    if (date) {
      setEndDate(date);
      if (date < startDate) setStartDate(date);
    }
  };

  const handleConfirm = () => {
    onConfirm(startDate, endDate);
    onClose();
  };

  const bg = isDark ? '#0F172A' : '#FFFFFF';
  const surface = isDark ? '#1E293B' : '#F8FAFC';
  const border = isDark ? '#334155' : '#E2E8F0';
  const text = isDark ? '#F1F5F9' : '#0F172A';
  const sub = isDark ? '#94A3B8' : '#64748B';

  const iconBgStyle = isDark ? styles.iconBoxBgDark : styles.iconBoxBgLight;
  const summaryBgStyle = isDark ? styles.summaryBgDark : styles.summaryBgLight;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} />

        <View style={[styles.sheet, { backgroundColor: bg }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: border }]} />

          {/* Header */}
          <View style={styles.header}>
            <Typography className="text-lg font-outfit-bold" style={{ color: text }}>
              {t('reports.customRange', 'Período Personalizado')}
            </Typography>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={sub} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Start Date */}
            <View style={[styles.section, { backgroundColor: surface, borderColor: border }]}>
              <View style={styles.row}>
                <View style={[styles.iconBox, iconBgStyle]}>
                  <Calendar size={18} color="#3B82F6" />
                </View>
                <View style={styles.dateInfo}>
                  <Typography style={[styles.labelText, { color: sub }]}>
                    {t('reports.startDate', 'Data Inicial')}
                  </Typography>
                  <Typography className="font-outfit-bold" style={[styles.dateValue, { color: text }]}>
                    {fmt(startDate)}
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveField(activeField === 'start' ? null : 'start')}
                  style={[styles.toggleBtn, { borderColor: border }]}
                >
                  <ChevronRight
                    size={16}
                    color="#3B82F6"
                    style={{ transform: [{ rotate: activeField === 'start' ? '90deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
              </View>

              {(activeField === 'start' || Platform.OS === 'ios') && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  maximumDate={new Date()}
                  onChange={handleStartChange}
                  style={styles.picker}
                  themeVariant={isDark ? 'dark' : 'light'}
                />
              )}
            </View>

            {/* End Date */}
            <View style={[styles.section, styles.sectionEnd, { backgroundColor: surface, borderColor: border }]}>
              <View style={styles.row}>
                <View style={[styles.iconBox, iconBgStyle]}>
                  <Calendar size={18} color="#3B82F6" />
                </View>
                <View style={styles.dateInfo}>
                  <Typography style={[styles.labelText, { color: sub }]}>
                    {t('reports.endDate', 'Data Final')}
                  </Typography>
                  <Typography className="font-outfit-bold" style={[styles.dateValue, { color: text }]}>
                    {fmt(endDate)}
                  </Typography>
                </View>
                <TouchableOpacity
                  onPress={() => setActiveField(activeField === 'end' ? null : 'end')}
                  style={[styles.toggleBtn, { borderColor: border }]}
                >
                  <ChevronRight
                    size={16}
                    color="#3B82F6"
                    style={{ transform: [{ rotate: activeField === 'end' ? '90deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
              </View>

              {(activeField === 'end' || Platform.OS === 'ios') && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  minimumDate={startDate}
                  maximumDate={new Date()}
                  onChange={handleEndChange}
                  style={styles.picker}
                  themeVariant={isDark ? 'dark' : 'light'}
                />
              )}
            </View>

            {/* Summary chip */}
            <View style={[styles.summary, summaryBgStyle]}>
              <Typography style={styles.summaryText} className="font-outfit-bold">
                {fmt(startDate)}  →  {fmt(endDate)}
              </Typography>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Typography className="font-outfit-bold" style={styles.confirmText}>
                {t('reports.applyRange', 'Aplicar Período')}
              </Typography>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  labelText: {
    fontSize: 11,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
  },
  sectionEnd: {
    marginTop: 12,
  },
  summaryText: {
    color: '#3B82F6',
    fontSize: 13,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
  },
  summary: {
    marginTop: 16,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  confirmBtn: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  picker: {
    marginTop: 8,
  },
  iconBoxBgDark: {
    backgroundColor: '#1E3A5F',
  },
  iconBoxBgLight: {
    backgroundColor: '#EFF6FF',
  },
  summaryBgDark: {
    backgroundColor: '#1E3A5F',
  },
  summaryBgLight: {
    backgroundColor: '#EFF6FF',
  },
});

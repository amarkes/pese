import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Pencil, Trash2, Scale, Droplet, Activity, Moon } from 'lucide-react-native';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { IconBox } from '@/components/atoms/IconBox';
import { GraphicIcon } from '@/components/atoms/GraphicIcon';
import { useTranslation } from 'react-i18next';
import { HistoryRecord } from '../hooks/useHistory';

interface HistoryCardProps {
  record: HistoryRecord;
  isDarkMode: boolean;
  onDelete: (record: HistoryRecord) => void;
  onEdit: (record: HistoryRecord) => void;
}

const getIcon = (type: string, isDarkMode: boolean) => {
  switch (type) {
    case 'weight': return { icon: Scale, color: isDarkMode ? "#60A5FA" : "#007AFF", bgColor: isDarkMode ? 'bg-blue-950' : 'bg-blue-50' };
    case 'water': return { icon: Droplet, color: isDarkMode ? "#60A5FA" : "#3B82F6", bgColor: isDarkMode ? 'bg-blue-950' : 'bg-blue-50' };
    case 'glucose': return { icon: Activity, color: isDarkMode ? "#FB923C" : "#F97316", bgColor: isDarkMode ? 'bg-orange-950' : 'bg-orange-50' };
    case 'sleep': return { icon: Moon, color: isDarkMode ? "#A5B4FC" : "#818CF8", bgColor: isDarkMode ? 'bg-indigo-950' : 'bg-indigo-50' };
    default: return { icon: Activity, color: isDarkMode ? "#94A3B8" : "#6C6C70", bgColor: isDarkMode ? 'bg-slate-900' : 'bg-slate-50' };
  }
};

const getTrendStyle = (type: string, trend?: 'up' | 'down' | 'stable'): { bg: string; text: string } => {
  if (!trend || trend === 'stable') {
    return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400' };
  }

  // Weight & Glucose: up = bad (red), down = good (green)
  // Water & Sleep:   up = good (green), down = bad (red)
  const isNegativeMetric = type === 'weight' || type === 'glucose';
  const upIsGood = !isNegativeMetric;

  const isGood = (trend === 'up') === upIsGood;

  return isGood
    ? { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-[#10B981] dark:text-[#10B981]' }
    : { bg: 'bg-rose-50 dark:bg-rose-950/30',    text: 'text-[#EF4444] dark:text-[#EF4444]' };
};

const getStatusStyle = (status?: string): { bg: string; text: string } => {
  if (!status) return { bg: '', text: '' };
  const s = status.toLowerCase();

  if (s.includes('normal') || s.includes('bem') || s.includes('done')) {
    return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' };
  }
  if (s.includes('pré') || s.includes('pre') || s.includes('melhorar') || s.includes('better')) {
    return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' };
  }
  if (s.includes('diabético') || s.includes('diabetic')) {
    return { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' };
  }
  if (s.includes('meta') || s.includes('goal') || s.includes('batida')) {
    return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' };
  }

  return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400' };
};

export const HistoryCard: React.FC<HistoryCardProps> = ({ record, isDarkMode, onDelete, onEdit }) => {
  const swipeableRef = useRef<Swipeable>(null);
  const { i18n } = useTranslation();
  const { icon, color, bgColor } = getIcon(record.type, isDarkMode);

  const handleEdit = () => {
    swipeableRef.current?.close();
    onEdit(record);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(record);
  };
  
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    return (
      <View className="flex-row items-center ml-4 gap-x-3">
        {record.type !== 'water' && (
          <TouchableOpacity 
            onPress={handleEdit}
            className="bg-blue-500 w-16 items-center justify-center rounded-2xl h-full max-h-[100px]"
          >
            <Animated.View style={{ transform: [{ scale }] }}>
              <Pencil size={20} color="white" />
            </Animated.View>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          onPress={handleDelete}
          className="bg-red-500 w-16 items-center justify-center rounded-2xl h-full max-h-[100px]"
        >
          <Animated.View style={{ transform: [{ scale }] }}>
            <Trash2 size={20} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const formattedTime = new Date(record.date).toLocaleTimeString(i18n.language, {
    hour: '2-digit', minute: '2-digit', hour12: false 
  });

  return (
    <View className="mb-4" style={cardStyles.overflow}>
      <Swipeable 
        ref={swipeableRef}
        renderRightActions={renderRightActions} 
        friction={2} 
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        containerStyle={cardStyles.overflow}
        childrenContainerStyle={cardStyles.overflow}
      >
        <Card className="flex-row items-center justify-between p-6">
        <View className="flex-row items-center flex-1">
          <IconBox 
            icon={icon} 
            color={color} 
            bgColor={bgColor} 
            size={24} 
            className="w-12 h-12" 
          />
          
          <View className="ml-4 flex-1">
             <View className="flex-row items-end">
               <Typography variant="h3" className="text-slate-800 dark:text-white mr-1">
                 {record.valueDisplay}
               </Typography>
               <Typography variant="body" className="text-sm font-outfit-bold text-slate-500 dark:text-slate-400 mb-0.5">
                 {record.unit}
               </Typography>
               {record.trend && record.trendValue && (() => {
                 const trendStyle = getTrendStyle(record.type, record.trend);
                 const isNegativeMetric = record.type === 'weight' || record.type === 'glucose';
                 const upIsGood = !isNegativeMetric;
                 const isGood = (record.trend === 'up') === upIsGood;
                 const iconColor = isGood ? '#10B981' : '#EF4444';
                 const isDown = record.trend === 'down';
                 return (
                   <View className={`flex-row items-center ml-2 px-2 py-0.5 rounded-full gap-x-1 ${trendStyle.bg}`}>
                     <GraphicIcon
                       fill={iconColor}
                       flipped={isDown}
                       width={16}
                       height={8}
                     />
                     <Typography className={`font-outfit-bold ${trendStyle.text}`}>
                       {record.trendValue}
                     </Typography>
                   </View>
                 );
               })()}
             </View>
             
             <Typography variant="label" className="text-xs text-slate-400 dark:text-slate-500 font-outfit-medium mt-1">
               {record.subtitle}
             </Typography>
          </View>
        </View>

        <View className="items-end">
           <Typography variant="body" className="text-sm text-slate-400 dark:text-slate-500 font-outfit-medium">
             {formattedTime}
           </Typography>
           
           {record.status && (
             <View className={`mt-2 px-3 py-1 rounded-full ${getStatusStyle(record.status).bg}`}>
                <Typography variant='label' className={`font-outfit-medium ${getStatusStyle(record.status).text}`}>
                   {record.status}
                </Typography>
             </View>
           )}
        </View>
      </Card>
      </Swipeable>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  overflow: { overflow: 'visible' },
});

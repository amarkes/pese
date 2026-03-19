import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Droplet, Trash2, Pencil } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Typography } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';

export const RecentActivityCard = ({ record, onDelete, formatTime, isDarkMode, onEdit }: any) => {
  const swipeableRef = useRef<Swipeable>(null);

  const handleDelete = () => {
    swipeableRef.current?.close();
    onDelete(record.id);
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    onEdit(record);
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
    return (
      <View className="flex-row items-center ml-2 gap-x-2">
        <TouchableOpacity onPress={handleEdit} className="bg-blue-500 w-14 items-center justify-center rounded-2xl h-full max-h-[100px] py-4">
          <Animated.View style={{ transform: [{ scale }] }}>
            <Pencil size={20} color="white" />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} className="bg-red-500 w-14 items-center justify-center rounded-2xl h-full max-h-[100px] py-4">
          <Animated.View style={{ transform: [{ scale }] }}>
            <Trash2 size={20} color="white" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="mb-3">
      <Swipeable 
        ref={swipeableRef} 
        renderRightActions={renderRightActions} 
        rightThreshold={40} 
        friction={2}
        containerStyle={styles.overflowVisible}
        childrenContainerStyle={styles.overflowVisible}
      >
        <Card className="flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 items-center justify-center">
            <Droplet size={20} color={isDarkMode ? "#60A5FA" : "#3B82F6"} />
          </View>
          <View className="ml-4 flex-1">
            <Typography className="font-outfit-bold text-slate-900 dark:text-white">
              {record.amount}ml
            </Typography>
            <Typography className="text-sm text-slate-500 font-outfit mt-0.5">
              Hoje, {formatTime(record.date)}
            </Typography>
          </View>
        </Card>
      </Swipeable>
    </View>
  );
};

const styles = StyleSheet.create({
  overflowVisible: {
    overflow: 'visible',
  },
});

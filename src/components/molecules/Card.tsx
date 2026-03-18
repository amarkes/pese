import React from 'react';
import { View, ViewProps, TouchableOpacityProps, TouchableOpacity } from 'react-native';

interface CardProps extends ViewProps {
  onPress?: TouchableOpacityProps['onPress'];
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  onPress, 
  className = '', 
  children, 
  ...props 
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { activeOpacity: 0.7, onPress } : {};

  return (
    <Container 
      className={`bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-50/5 dark:border-slate-800 ${className}`} 
      {...containerProps}
      {...props}
    >
      {children}
    </Container>
  );
};

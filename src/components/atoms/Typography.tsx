import React from 'react';
import { Text, TextProps } from 'react-native';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  className?: string;
  children: React.ReactNode;
}

const variants = {
  h1: 'text-3xl font-inter-bold text-text dark:text-text-dark',
  h2: 'text-2xl font-inter-semibold text-text dark:text-text-dark',
  h3: 'text-xl font-inter-semibold text-text dark:text-text-dark',
  body: 'text-base font-inter text-text dark:text-text-dark',
  caption: 'text-sm font-inter text-text-secondary dark:text-text-secondary-dark',
  label: 'text-xs font-inter-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider',
};

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <Text 
      className={`${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </Text>
  );
};

import React from 'react';
import { Text, TextProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  className?: string;
  children: React.ReactNode;
}

const variants = {
  h1: 'text-3xl font-outfit-bold text-text dark:text-text-dark',
  h2: 'text-2xl font-outfit-semibold text-text dark:text-text-dark',
  h3: 'text-xl font-outfit-semibold text-text dark:text-text-dark',
  body: 'text-base font-outfit text-text dark:text-text-dark',
  caption: 'text-sm font-outfit text-text-secondary dark:text-text-secondary-dark',
  label: 'text-xs font-outfit-medium text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider',
};

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <Text 
      className={twMerge(variants[variant], className)}
      allowFontScaling={false}
      {...props}
    >
      {children}
    </Text>
  );
};

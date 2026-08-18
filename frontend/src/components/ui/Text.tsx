import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface TextProps extends RNTextProps {
  variant?: keyof typeof theme.typography;
}

export function Text({ style, variant = 'body', ...props }: TextProps) {
  return (
    <RNText style={[styles.base, theme.typography[variant], style]} {...props} />
  );
}

const styles = StyleSheet.create({
  base: {
    // Shared base text styles can go here
  },
});

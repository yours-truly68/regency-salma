import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...props }: CardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...theme.shadows.card,
  },
});

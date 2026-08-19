import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

interface ScreenEntranceProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  delay?: number;
}

export function ScreenEntrance({ children, style }: ScreenEntranceProps) {
  return (
    <View style={style}>
      {children}
    </View>
  );
}

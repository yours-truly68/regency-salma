import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.line} />
      <Text style={styles.text}>or</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  text: {
    marginHorizontal: theme.spacing.m,
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
});

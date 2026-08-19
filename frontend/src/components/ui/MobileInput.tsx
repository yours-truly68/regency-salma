import React from 'react';
import { Feather } from '@expo/vector-icons';
import { View, TextInput, StyleSheet } from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';

export function MobileInput({ value, onChangeText, disabled }: { value: string, onChangeText: (v: string) => void, disabled?: boolean }) {
  return (
    <View style={styles.container}>
      <Text variant="label" style={styles.label}>Mobile Number</Text>
      <View style={[styles.inputWrapper, disabled && styles.disabled]}>
        <View style={styles.prefixContainer}>
          <Text style={styles.prefixText}>+971</Text>
          <Feather name="chevron-down" size={16} color={theme.colors.textPrimary} style={{marginLeft: 4}} />
        </View>
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          keyboardType="phone-pad"
          editable={!disabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.textPrimary,
  },
  inputWrapper: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.m,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: theme.colors.background,
    opacity: 0.6,
  },
  prefixContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  prefixText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: theme.spacing.m,
    color: theme.colors.textPrimary,
    fontSize: 16,
  },
});

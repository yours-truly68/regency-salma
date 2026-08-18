import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './Text';
import { theme } from '../../theme';

interface RoleSelectorProps {
  selected: 'owner' | 'tenant';
  onChange: (role: 'owner' | 'tenant') => void;
}

export function RoleSelector({ selected, onChange }: RoleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text variant="label" style={styles.label}>I am a</Text>
      <View style={styles.row}>
        <TouchableOpacity 
          style={[styles.option, selected === 'owner' && styles.selected]}
          onPress={() => onChange('owner')}
        >
          <Feather name="user" size={24} color={selected === 'owner' ? theme.colors.primary : theme.colors.accent} />
          <Text style={[styles.text, selected === 'owner' ? styles.selectedText : styles.unselectedText]}>
            Owner / Resident
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.option, selected === 'tenant' && styles.selected]}
          onPress={() => onChange('tenant')}
        >
          <Feather name="user" size={24} color={selected === 'tenant' ? theme.colors.primary : theme.colors.accent} />
          <Text style={[styles.text, selected === 'tenant' ? styles.selectedText : styles.unselectedText]}>
            Tenant
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    marginBottom: theme.spacing.s,
    textTransform: 'none',
    fontWeight: '400',
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.m,
  },
  option: {
    flex: 1,
    height: 80,
    borderRadius: theme.radii.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  selected: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  text: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  selectedText: {
    color: theme.colors.primary,
  },
  unselectedText: {
    color: theme.colors.accent,
  },
});

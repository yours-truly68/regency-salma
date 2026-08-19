import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './Text';
import { theme } from '../../theme';

interface RoleSelectorProps {
  selected: 'owner' | 'tenant';
  onChange: (role: 'owner' | 'tenant') => void;
}

interface RoleTileProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  selected: boolean;
  selectedColor: string;
  selectedBackground: string;
  selectedBorderColor: string;
  onPress: () => void;
}

function RoleTile({
  icon,
  label,
  selected,
  selectedColor,
  selectedBackground,
  selectedBorderColor,
  onPress,
}: RoleTileProps) {
  const pop = useRef(new Animated.Value(1)).current;
  const check = useRef(new Animated.Value(0)).current;

  const bounce = () => {
    pop.setValue(1);
    Animated.sequence([
      Animated.spring(pop, {
        toValue: 1.08,
        friction: 4,
        tension: 240,
        useNativeDriver: true,
      }),
      Animated.spring(pop, {
        toValue: 1,
        friction: 6,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (selected) {
      bounce();
    }
    onPress();
  };

  useEffect(() => {
    if (selected) {
      bounce();
    }

    Animated.spring(check, {
      toValue: selected ? 1 : 0,
      friction: 7,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }, [selected, pop, check]);

  const iconColor = selected ? selectedColor : theme.colors.textSecondary;
  const textColor = selected ? selectedColor : theme.colors.textPrimary;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.tile,
        selected && {
          backgroundColor: selectedBackground,
          borderColor: selectedColor,
          borderBottomColor: selectedBorderColor,
        },
        pressed && styles.tilePressed,
      ]}
    >
      <Animated.View style={[styles.tileInner, { transform: [{ scale: pop }] }]}>
        <Feather name={icon} size={22} color={iconColor} />

        <Text numberOfLines={1} style={[styles.tileText, { color: textColor }]}>
          {label}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.checkBadge,
          {
            borderColor: selectedColor,
            opacity: check,
            transform: [{ scale: check }],
          },
        ]}
      >
        <Feather name="check" size={11} color={selectedColor} />
      </Animated.View>
    </Pressable>
  );
}

export function RoleSelector({ selected, onChange }: RoleSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>I am a</Text>

      <View style={styles.row}>
        <RoleTile
          icon="home"
          label="Owner / Resident"
          selected={selected === 'owner'}
          selectedColor={theme.colors.primary}
          selectedBackground="#F3F8F5"
          selectedBorderColor="#0E2B1E"
          onPress={() => onChange('owner')}
        />

        <RoleTile
          icon="user"
          label="Tenant"
          selected={selected === 'tenant'}
          selectedColor={theme.colors.accent}
          selectedBackground="#FBF4F0"
          selectedBorderColor="#B45F4B"
          onPress={() => onChange('tenant')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 10,
    color: theme.colors.textPrimary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 16,
    lineHeight: 21,
  },

  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },

  tile: {
    flex: 1,
    minHeight: 74,
    flexShrink: 0,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E4E2',
    borderBottomWidth: 5,
    borderBottomColor: '#CCD1D3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  tilePressed: {
    borderBottomWidth: 1.5,
  },

  tileInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  tileText: {
    marginTop: 6,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
  },

  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
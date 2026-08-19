import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from './Text';
import { PremiumPressable } from './PremiumPressable';
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
    <PremiumPressable
      onPress={handlePress}
      scaleTo={0.95}
      activeOpacity={0.9}
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
        <Feather name={icon} size={24} color={iconColor} />

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
    </PremiumPressable>
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
    marginBottom: 16,
  },

  label: {
    marginBottom: 10,
    color: theme.colors.textPrimary,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
    lineHeight: 24,
  },

  row: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    alignItems: 'stretch',
  },

  tile: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 164,
    minHeight: 140,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E0E4E2',
    borderBottomWidth: 6,
    borderBottomColor: '#CCD1D3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  tilePressed: {
    borderBottomWidth: 2,
  },

  tileInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  tileText: {
    marginTop: 8,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },

  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
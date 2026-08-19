import { Ionicons } from '@expo/vector-icons';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs } from 'expo-router';
import { theme } from '../../src/theme';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../src/components/ui/Text';
import { WelcomeHomeAnimation } from '../../src/components/welcome-home-animation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';

interface BouncyTabProps {
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  isFocused: boolean;
  onPress: () => void;
}

function BouncyTabItem({ activeIcon, inactiveIcon, label, isFocused, onPress }: BouncyTabProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pillScale = useRef(new Animated.Value(isFocused ? 1 : 0.7)).current;
  const pillOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            friction: 3,
            tension: 220,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 180,
            useNativeDriver: true,
          }),
        ]),
        Animated.spring(pillScale, {
          toValue: 1,
          friction: 4,
          tension: 180,
          useNativeDriver: true,
        }),
        Animated.timing(pillOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 160,
          useNativeDriver: true,
        }),
        Animated.spring(pillScale, {
          toValue: 0.7,
          friction: 5,
          tension: 160,
          useNativeDriver: true,
        }),
        Animated.timing(pillOpacity, {
          toValue: 0,
          duration: 140,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, pillOpacity, pillScale, scaleAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.86,
      friction: 4,
      tension: 260,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 180,
      useNativeDriver: true,
    }).start();
  };

  const activeColor = theme.colors.primary;
  const inactiveColor = '#78828A';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
    >
      <Animated.View
        style={[
          styles.tabPill,
          {
            opacity: pillOpacity,
            transform: [{ scale: pillScale }],
          },
        ]}
      />
      <Animated.View style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}>
        <Ionicons
          name={isFocused ? activeIcon : inactiveIcon}
          size={25}
          color={isFocused ? activeColor : inactiveColor}
        />
        <Text
          style={[
            styles.tabLabel,
            {
              color: isFocused ? activeColor : inactiveColor,
              fontFamily: isFocused ? 'PlusJakartaSans_700Bold' : 'PlusJakartaSans_600SemiBold',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function BouncyCenterButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.90,
        friction: 4,
        tension: 260,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 3,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.15,
          friction: 3,
          tension: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.centerSlot}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.centerPressable}
      >
        <Animated.View
          style={[
            styles.centerButton,
            {
              transform: [{ scale }, { translateY }],
            },
          ]}
        >
          <View style={styles.centerDots}>
            <View style={styles.dot} /><View style={styles.dot} />
            <View style={styles.dot} /><View style={styles.dot} />
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const currentRoute = state.routes[state.index]?.name;
  const isTopLevelTab = ['home', 'community', 'services', 'profile'].includes(currentRoute);
  
  if (!isTopLevelTab) {
    return null;
  }
  
  const handleTabPress = (name: string) => {
    const routeIndex = state.routes.findIndex((r: any) => r.name === name);
    const isFocused = state.index === routeIndex;

    if (routeIndex !== -1) {
      const event = navigation.emit({
        type: 'tabPress',
        target: state.routes[routeIndex].key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(name);
      }
    }
  };

  const getIsFocused = (name: string) => {
    const routeIndex = state.routes.findIndex((r: any) => r.name === name);
    return state.index === routeIndex;
  };

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.tabBarContainer}>
        <BouncyTabItem
          activeIcon="home"
          inactiveIcon="home-outline"
          label="Home"
          isFocused={getIsFocused('home')}
          onPress={() => handleTabPress('home')}
        />
        <BouncyTabItem
          activeIcon="people"
          inactiveIcon="people-outline"
          label="Community"
          isFocused={getIsFocused('community')}
          onPress={() => handleTabPress('community')}
        />
        
        <BouncyCenterButton onPress={() => navigation.navigate('quick-actions')} />

        <BouncyTabItem
          activeIcon="grid"
          inactiveIcon="grid-outline"
          label="Services"
          isFocused={getIsFocused('services')}
          onPress={() => handleTabPress('services')}
        />
        <BouncyTabItem
          activeIcon="person"
          inactiveIcon="person-outline"
          label="Profile"
          isFocused={getIsFocused('profile')}
          onPress={() => handleTabPress('profile')}
        />
      </View>
    </View>
  );
}

import { useSession } from '../../src/store/auth';
import { Redirect } from 'expo-router';

export default function AppLayout() {
  const { user, isLoading, isAuthenticated } = useSession();
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  const userId = user?.id || 'u123';
  const communityId = 'c1';
  const communityName = 'Regency Salma';
  const unitNumber = user?.unitNumber || '9A';
  const firstName = user?.firstName || 'Resident';

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkWelcome = async () => {
      try {
        const key = `welcome-home-seen:${userId}:${communityId}:${unitNumber}`;
        const hasSeen = await AsyncStorage.getItem(key);
        if (hasSeen === 'true') {
          setShowWelcome(false);
        } else {
          setShowWelcome(true);
        }
      } catch {
        console.warn('Storage error');
        setShowWelcome(false);
      }
    };
    checkWelcome();
  }, [isAuthenticated, user, userId, communityId, unitNumber]);

  const handleWelcomeComplete = async () => {
    try {
      const key = `welcome-home-seen:${userId}:${communityId}:${unitNumber}`;
      await AsyncStorage.setItem(key, 'true');
    } catch {
      console.warn('Storage error');
    }
    setShowWelcome(false);
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (showWelcome === null) return null; // wait for check

  return (
    <View style={{ flex: 1 }}>
      {showWelcome && (
        <WelcomeHomeAnimation
          userId={userId}
          communityId={communityId}
          communityName={communityName}
          unitNumber={unitNumber}
          firstName={firstName}
          onComplete={handleWelcomeComplete}
        />
      )}
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'shift',
          tabBarStyle: { display: showWelcome ? 'none' : 'flex' },
        }}
      >
        <Tabs.Screen name="home" options={{ title: 'Home' }} />
        <Tabs.Screen name="community" options={{ title: 'Community' }} />
        <Tabs.Screen name="services" options={{ title: 'Services' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="quick-actions" options={{ href: null }} />
        <Tabs.Screen name="announcements" options={{ href: null }} />
        <Tabs.Screen name="my-home" options={{ href: null }} />
        <Tabs.Screen name="calendar" options={{ href: null }} />
        <Tabs.Screen name="activity-overview" options={{ href: null }} />
        <Tabs.Screen name="family-members" options={{ href: null }} />
        <Tabs.Screen name="profile-settings" options={{ href: null }} />
        <Tabs.Screen name="visitors/index" options={{ href: null }} />
        <Tabs.Screen name="visitors/[id]" options={{ href: null }} />
        <Tabs.Screen name="services/maintenance" options={{ href: null }} />
        <Tabs.Screen name="services/staff-attendance" options={{ href: null }} />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
    height: 58,
  },
  tabItem: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabPill: {
    position: 'absolute',
    width: '80%',
    height: 46,
    borderRadius: 14,
    backgroundColor: '#ECFDF5',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10.5,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  centerSlot: {
    width: 58,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    borderBottomWidth: 3,
    borderBottomColor: '#0A2016',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 7,
  },
  centerDots: {
    width: 14,
    height: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FFFFFF',
  },
});

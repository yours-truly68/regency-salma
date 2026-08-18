/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs } from 'expo-router';
import { theme } from '../../src/theme';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../src/components/ui/Text';

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  
  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const label = options.title !== undefined ? options.title : route.name;
    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    let iconName: any = 'home';
    if (route.name === 'home') iconName = 'home';
    else if (route.name === 'community') iconName = 'users';
    else if (route.name === 'services') iconName = 'shield';
    else if (route.name === 'profile') iconName = 'user';

    const color = isFocused ? theme.colors.primary : theme.colors.textSecondary;

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        style={styles.tabItem}
      >
        <Feather name={iconName} size={24} color={color} />
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {state.routes[0] && renderTab(state.routes[0], 0)}
      {state.routes[1] && renderTab(state.routes[1], 1)}
      
      <TouchableOpacity style={styles.centerButton} onPress={() => navigation.navigate('quick-actions')} activeOpacity={0.8}>
        <View style={styles.centerDots}>
          <View style={styles.dot} /><View style={styles.dot} />
          <View style={styles.dot} /><View style={styles.dot} />
        </View>
      </TouchableOpacity>

      {state.routes[2] && renderTab(state.routes[2], 2)}
      {state.routes[3] && renderTab(state.routes[3], 3)}
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="community" options={{ title: 'Community' }} />
      <Tabs.Screen name="services" options={{ title: 'Services' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="quick-actions" options={{ href: null }} />
      <Tabs.Screen name="announcements" options={{ href: null }} />
      <Tabs.Screen name="my-home" options={{ href: null }} />
      <Tabs.Screen name="visitors/index" options={{ href: null }} />
      <Tabs.Screen name="visitors/[id]" options={{ href: null }} />
      <Tabs.Screen name="services/maintenance" options={{ href: null }} />
      <Tabs.Screen name="services/staff-attendance" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28, 
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: 8,
  },
  centerDots: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
  }
});

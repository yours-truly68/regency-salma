import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../src/components/ui/Text';
import { ScreenEntrance } from '../../src/components/ui/ScreenEntrance';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { theme } from '../../src/theme';
import { useSession } from '../../src/store/auth';

type AnnouncementSpace = 'leadership' | 'owners' | 'residents';

export default function AnnouncementsScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(false);
  const { user } = useSession() || {};

  // Fake the role for testing, since auth store doesn't have it explicitly right now.
  // We'll assume TENANT or RESIDENT for this mock unless overridden.
  const userRole = (user as any)?.role || 'RESIDENT';

  const availableSpaces = useMemo(() => {
    if (userRole === 'LEADERSHIP') return ['leadership', 'owners', 'residents'];
    if (userRole === 'OWNER') return ['owners', 'residents'];
    return ['residents'];
  }, [userRole]);

  const [activeSpace, setActiveSpace] = useState<AnnouncementSpace>(availableSpaces[0] as AnnouncementSpace);
  const [activeCategory] = useState<string>('all');

  // Hardcoded empty state for now to demonstrate empty states as requested
  const FIXTURES: any[] = [];

  const filteredFixtures = FIXTURES.filter(f => {
    if (f.space !== activeSpace) return false;
    if (activeCategory !== 'all' && f.category !== activeCategory) return false;
    return true;
  });

  const getEmptyStateCopy = () => {
    if (FIXTURES.filter(f => f.space === activeSpace).length === 0) {
      if (activeSpace === 'leadership') {
        return {
          title: "No leadership announcements yet.",
          desc: "Important updates from community leadership will appear here."
        };
      }
      if (activeSpace === 'owners') {
        return {
          title: "No owner announcements yet.",
          desc: "Updates for property owners will appear here."
        };
      }
      return {
        title: "No resident announcements yet.",
        desc: "Community updates for residents will appear here."
      };
    }
    return {
      title: "No announcements match this filter.",
      desc: "Try another category or clear the filter."
    };
  };

  const emptyState = getEmptyStateCopy();

  return (
    <View style={styles.container}>
      <AppHeader
        variant="subscreen"
        title="Announcements"
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.spacesWrapper} contentContainerStyle={styles.spacesContent}>
        {availableSpaces.map((space) => (
          <PremiumPressable
            key={space}
            style={[styles.spaceTab, activeSpace === space && styles.spaceTabActive]}
            onPress={() => setActiveSpace(space as AnnouncementSpace)}
          >
            <Text style={[styles.spaceTabText, activeSpace === space && styles.spaceTabTextActive]}>
              {space.charAt(0).toUpperCase() + space.slice(1)}
            </Text>
          </PremiumPressable>
        ))}
      </ScrollView>

      {/* Optional: Filter categories could go here, but omitted for brevity if spaces are the primary tabs */}

      <ScrollView contentContainerStyle={[styles.list, { paddingBottom: bottomClearance }]}>
        {filteredFixtures.length > 0 ? (
          filteredFixtures.map((ann, index) => (
            <ScreenEntrance key={ann.id} delay={100 + index * 100}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.category}>{ann.category}</Text>
                  <Text style={styles.date}>{ann.date}</Text>
                </View>
                <Text style={styles.title}>{ann.title}</Text>
                <Text style={styles.desc}>{ann.desc}</Text>
              </View>
            </ScreenEntrance>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyCard}>
              <Feather name="bell" size={32} color={theme.colors.textSecondary} style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>{emptyState.title}</Text>
              <Text style={styles.emptyDesc}>{emptyState.desc}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  spacesWrapper: { maxHeight: 48, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  spacesContent: { paddingHorizontal: 20, alignItems: 'center' },
  spaceTab: { paddingVertical: 14, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  spaceTabActive: { borderBottomColor: theme.colors.primary },
  spaceTabText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15, color: theme.colors.textSecondary },
  spaceTabTextActive: { color: theme.colors.primary },
  list: { padding: 20, flexGrow: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 36,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  emptyIcon: { marginBottom: 18, opacity: 0.8 },
  emptyTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 8 },
  emptyDesc: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 15, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 23 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  category: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12, color: theme.colors.accent, textTransform: 'uppercase', letterSpacing: 0.8 },
  date: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: theme.colors.textSecondary },
  title: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 17, letterSpacing: -0.3, color: theme.colors.textPrimary, marginBottom: 8 },
  desc: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },
});

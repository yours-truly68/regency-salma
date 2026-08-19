import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../src/components/ui/Text';
import { Skeleton } from '../../src/components/ui/Skeleton';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { theme } from '../../src/theme';

export default function ServicesScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fake loading delay to demonstrate skeleton
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <AppHeader variant="tabroot" title="Services" />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]}>
        {loading ? (
          <View style={{ gap: 16 }}>
            <Skeleton height={88} borderRadius={16} />
            <Skeleton height={88} borderRadius={16} />
            <Skeleton height={88} borderRadius={16} />
            <Skeleton height={88} borderRadius={16} />
          </View>
        ) : (
          <View style={{ gap: 16 }}>

            {/* Maintenance */}
            <PremiumPressable style={styles.card} onPress={() => router.push('/services/maintenance')}>
              <View style={[styles.iconContainer, { backgroundColor: '#E8F5E9' }]}>
                <Feather name="tool" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Maintenance</Text>
                <Text style={styles.cardDesc}>Raise and track repair requests</Text>
                <Text style={styles.cardMeta}>1 Open Ticket</Text>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </PremiumPressable>

            {/* Staff Attendance */}
            <PremiumPressable style={styles.card} onPress={() => router.push('/services/staff-attendance')}>
              <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                <Feather name="users" size={20} color="#1976D2" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Staff Attendance</Text>
                <Text style={styles.cardDesc}>Manage maids, cooks, and drivers</Text>
                <Text style={styles.cardMeta}>2 / 3 Present Today</Text>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </PremiumPressable>

            {/* Announcements */}
            <PremiumPressable style={styles.card} onPress={() => router.push('/announcements')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                <Feather name="bell" size={20} color={theme.colors.accent} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Announcements</Text>
                <Text style={styles.cardDesc}>Important community updates</Text>
                <Text style={styles.cardMetaAlert}>2 Unread</Text>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
            </PremiumPressable>

            {/* Emergency */}
            <PremiumPressable style={[styles.card, styles.emergencyCard]} onPress={() => alert('Emergency SOS triggered.')}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFEBEE' }]}>
                <Feather name="shield" size={24} color={theme.colors.error} />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.emergencyTitle}>Emergency SOS</Text>
                <Text style={styles.emergencyDesc}>Instantly alert security and neighbors</Text>
              </View>
              <Feather name="chevron-right" size={20} color={theme.colors.error} />
            </PremiumPressable>

          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16 },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    letterSpacing: -0.3,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  cardMeta: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  cardMetaAlert: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: theme.colors.accent,
  },

  emergencyCard: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
    backgroundColor: '#FFFBFB',
  },
  emergencyTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 17,
    letterSpacing: -0.3,
    color: theme.colors.error,
    marginBottom: 4,
  },
  emergencyDesc: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 14,
    color: theme.colors.error,
    opacity: 0.85,
    lineHeight: 20,
  }
});

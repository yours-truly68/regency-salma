import { PremiumPressable } from '../../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { Text } from '../../../src/components/ui/Text';
import { Button } from '../../../src/components/ui/Button';
import { ScreenEntrance } from '../../../src/components/ui/ScreenEntrance';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../../src/hooks/useScreenInsets';
import { useIssues, removeIssue, ISSUE_CATEGORIES } from '../../../src/store/issues';
import { theme } from '../../../src/theme';

export default function MaintenanceScreen() {
  const router = useRouter();
  const { bottom, bottomClearance } = useScreenInsets(false);
  const [activeTab, setActiveTab] = useState<'my'|'all'>('my');
  const allIssues = useIssues();
  const requests = activeTab === 'all' ? allIssues : allIssues.filter((i) => i.status !== 'Resolved');

  return (
    <View style={styles.container}>
      <AppHeader
        variant="subscreen"
        title="Maintenance"
        onBackPress={() => router.canGoBack() ? router.back() : router.replace('/services')}
      />

      <View style={styles.tabs}>
        <PremiumPressable
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>My Requests</Text>
        </PremiumPressable>
        <PremiumPressable
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All Requests</Text>
        </PremiumPressable>
      </View>

      <ScrollView contentContainerStyle={[styles.list, { paddingBottom: bottomClearance + 60 }]}>
        {requests.length > 0 ? ( requests.map((req, index) => {
          const meta = ISSUE_CATEGORIES.find((c) => c.id === req.category);
          return (
          <ScreenEntrance key={req.id} delay={100 + index * 100}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryRow}>
                  <Feather name={req.icon} size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.categoryText}>{req.category}</Text>
                </View>
                <View style={styles.headerRight}>
                  <Text style={styles.ticketId}>{req.id}</Text>
                  <PremiumPressable
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={() => removeIssue(req.id)}
                  >
                    <Feather name="trash-2" size={14} color={theme.colors.error} />
                  </PremiumPressable>
                </View>
              </View>
              <Text style={styles.title}>{req.title}</Text>
              <Text style={styles.desc}>{meta?.hint ?? req.category}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.time}>{req.time}</Text>
                <View style={[styles.statusBadge, req.status === 'Resolved' ? styles.statusResolved : styles.statusInProgress]}>
                  <Text style={[styles.statusText, req.status === 'Resolved' ? styles.statusTextResolved : styles.statusTextInProgress]}>
                    {req.status}
                  </Text>
                </View>
              </View>
            </View>
          </ScreenEntrance>
        )})) : (
          <EmptyState
            icon="tool"
            title="No maintenance requests"
            description="You do not have any open maintenance issues currently."
          />
        )}
      </ScrollView>

      <View style={[styles.bottomAction, { paddingBottom: Math.max(bottom, 16) }]}>
        <Button label="Raise New Request" onPress={() => router.push('/services/raise-issue')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingHorizontal: 20 },
  tab: { paddingVertical: 14, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: theme.colors.primary },
  tabText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15, color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.primary },
  list: { padding: 20, paddingBottom: 110 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryText: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: theme.colors.textSecondary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ticketId: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: theme.colors.textSecondary },
  title: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 17, letterSpacing: -0.3, color: theme.colors.textPrimary, marginBottom: 6 },
  desc: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: theme.colors.textSecondary, marginBottom: 14, lineHeight: 21 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: theme.colors.textSecondary },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100 },
  statusInProgress: { backgroundColor: '#EFF6FF' },
  statusResolved: { backgroundColor: '#ECFDF5' },
  statusText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12 },
  statusTextInProgress: { color: '#1D4ED8' },
  statusTextResolved: { color: '#047857' },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  }
});

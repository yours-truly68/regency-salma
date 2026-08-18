import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../../src/components/ui/Text';
import { Button } from '../../../src/components/ui/Button';
import { AnimatedEntrance } from '../../../src/components/ui/AnimatedEntrance';
import { theme } from '../../../src/theme';

const FIXTURES = [
  { id: '1', name: 'Rahul Sharma', type: 'Personal Visitor', time: '6:30 PM', status: 'pending', group: 'Today' },
  { id: '2', name: 'Amazon Delivery', type: 'Delivery', time: '2:15 PM', status: 'approved', group: 'Today' },
  { id: '3', name: 'Plumber', type: 'Service', time: '10:00 AM', status: 'pending', group: 'Tomorrow' },
];

export default function VisitorsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'upcoming'|'history'>('upcoming');

  const renderVisitorCard = (visitor: { id: string; name: string; type: string; time: string; status: string; group: string }, index: number) => {
    return (
      <AnimatedEntrance key={visitor.id} delay={100 + index * 100}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{visitor.name.charAt(0)}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.visitorName}>{visitor.name}</Text>
              <Text style={styles.visitorMeta}>{visitor.type} · {visitor.time}</Text>
            </View>
            <View style={[styles.statusBadge, visitor.status === 'approved' ? styles.statusApproved : styles.statusPending]}>
              <Text style={[styles.statusText, visitor.status === 'approved' ? styles.statusTextApproved : styles.statusTextPending]}>
                {visitor.status === 'approved' ? 'Approved' : 'Pending'}
              </Text>
            </View>
          </View>

          {visitor.status === 'pending' ? (
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionBtnOutline}>
                <Text style={styles.actionBtnOutlineText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtnSolid} onPress={() => router.push(`/visitors/${visitor.id}`)}>
                <Text style={styles.actionBtnSolidText}>Approve</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionBtnOutline} onPress={() => router.push(`/visitors/${visitor.id}`)}>
                <Text style={styles.actionBtnOutlineText}>View OTP</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </AnimatedEntrance>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visitors</Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="filter" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {/* Today Group */}
        <Text style={styles.groupHeader}>Today</Text>
        {FIXTURES.filter(f => f.group === 'Today').map(renderVisitorCard)}
        
        {/* Tomorrow Group */}
        <Text style={styles.groupHeader}>Tomorrow</Text>
        {FIXTURES.filter(f => f.group === 'Tomorrow').map(renderVisitorCard)}
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button label="Add New Visitor" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  badge: {
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10,
    color: '#FFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  groupHeader: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  cardInfo: {
    flex: 1,
  },
  visitorName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  visitorMeta: {
    fontFamily: 'PlusJakartaSans_500Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusApproved: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 10,
  },
  statusTextPending: {
    color: '#E65100',
  },
  statusTextApproved: {
    color: '#2E7D32',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnOutline: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnOutlineText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  actionBtnSolid: {
    flex: 1,
    height: 36,
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnSolidText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
    color: '#FFF',
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  }
});

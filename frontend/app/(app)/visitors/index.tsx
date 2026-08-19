import { PremiumPressable } from '../../../src/components/ui/PremiumPressable';
import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../../src/components/ui/Text';
import { Button } from '../../../src/components/ui/Button';
import { ScreenEntrance } from '../../../src/components/ui/ScreenEntrance';
import { VisitorApprovalCard } from '../../../src/components/visitor-approval-card';
import { AddVisitorModal } from '../../../src/components/add-visitor-modal';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../../src/hooks/useScreenInsets';
import { theme } from '../../../src/theme';

const FIXTURES = [
  { id: '1', name: 'Rahul Sharma', type: 'Personal Visitor', time: '6:30 PM', status: 'pending', group: 'Today' },
  { id: '2', name: 'Amazon Delivery', type: 'Delivery', time: '2:15 PM', status: 'approved', group: 'Today' },
  { id: '3', name: 'Plumber', type: 'Service', time: '10:00 AM', status: 'pending', group: 'Tomorrow' },
];

export default function VisitorsScreen() {
  const router = useRouter();
  const { bottom, bottomClearance } = useScreenInsets(false);
  const [activeTab, setActiveTab] = useState<'upcoming'|'history'>('upcoming');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visitors, setVisitors] = useState(FIXTURES);

  const handleDeleteVisitor = (id: string) => {
    setVisitors((prev) => prev.filter((v) => v.id !== id));
  };

  const handleCopyOtp = async (id: string, otp: string) => {
    await Clipboard.setStringAsync(otp);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  const renderVisitorCard = (visitor: { id: string; name: string; type: string; time: string; status: string; group: string }, index: number) => {
    if (visitor.status === 'pending') {
      return (
        <ScreenEntrance key={visitor.id} delay={100 + index * 100}>
          <VisitorApprovalCard
            visitor={{ id: visitor.id, name: visitor.name, type: visitor.type, time: visitor.time, otp: '3941' }}
            onDelete={handleDeleteVisitor}
            onPress={() => router.push(`/visitors/${visitor.id}`)}
          />
        </ScreenEntrance>
      );
    }

    return (
      <ScreenEntrance key={visitor.id} delay={100 + index * 100}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{visitor.name.charAt(0)}</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.visitorName}>{visitor.name}</Text>
              <Text style={styles.visitorMeta}>{visitor.type} · {visitor.time}</Text>
            </View>
            <View style={[styles.statusBadge, styles.statusApproved]}>
              <Text style={[styles.statusText, styles.statusTextApproved]}>Approved</Text>
            </View>
          </View>
        </View>
      </ScreenEntrance>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        variant="subscreen"
        title="Visitors"
        rightAction={
          <PremiumPressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.headerIconBtn}
          >
            <Feather name="filter" size={20} color={theme.colors.textPrimary} />
          </PremiumPressable>
        }
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        <PremiumPressable
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
        </PremiumPressable>
        <PremiumPressable
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History</Text>
        </PremiumPressable>
      </View>

      <ScrollView contentContainerStyle={[styles.listContent, { paddingBottom: bottomClearance + 60 }]}>
        {/* Today Group */}
        <Text style={styles.groupHeader}>Today</Text>
        {visitors.filter(f => f.group === 'Today').map(renderVisitorCard)}

        {/* Tomorrow Group */}
        <Text style={styles.groupHeader}>Tomorrow</Text>
        {visitors.filter(f => f.group === 'Tomorrow').map(renderVisitorCard)}
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: Math.max(bottom, 16) }]}>
        <Button label="Add New Visitor" onPress={() => setShowAddModal(true)} />
      </View>

      <AddVisitorModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  badge: {
    backgroundColor: theme.colors.accent,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 11,
    color: '#FFF',
  },
  listContent: {
    padding: 20,
    paddingBottom: 110,
  },
  groupHeader: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    letterSpacing: -0.3,
    color: theme.colors.textPrimary,
    marginBottom: 14,
    marginTop: 8,
  },
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  avatarText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  cardInfo: {
    flex: 1,
  },
  visitorName: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 16,
    letterSpacing: -0.2,
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  visitorMeta: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  statusApproved: {
    backgroundColor: '#ECFDF5',
  },
  statusText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
  },
  statusTextApproved: {
    color: '#047857',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
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

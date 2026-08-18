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
  { id: 'REQ-0192', category: 'Plumbing', title: 'Leaking pipe in master bathroom', desc: 'Water is slowly leaking under the sink.', status: 'In Progress', time: 'Today, 10:30 AM' },
  { id: 'REQ-0185', category: 'Electrical', title: 'Hallway light flickers', desc: 'The bulb needs replacement.', status: 'Resolved', time: 'Yesterday, 2:00 PM' },
];

export default function MaintenanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'my'|'all'>('my');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maintenance</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'my' && styles.tabActive]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>My Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>All Requests</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {FIXTURES.map((req, index) => (
          <AnimatedEntrance key={req.id} delay={100 + index * 100}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.categoryRow}>
                  <Feather name={req.category === 'Plumbing' ? 'tool' : 'zap'} size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.categoryText}>{req.category}</Text>
                </View>
                <Text style={styles.ticketId}>{req.id}</Text>
              </View>
              <Text style={styles.title}>{req.title}</Text>
              <Text style={styles.desc}>{req.desc}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.time}>{req.time}</Text>
                <View style={[styles.statusBadge, req.status === 'Resolved' ? styles.statusResolved : styles.statusInProgress]}>
                  <Text style={[styles.statusText, req.status === 'Resolved' ? styles.statusTextResolved : styles.statusTextInProgress]}>{req.status}</Text>
                </View>
              </View>
            </View>
          </AnimatedEntrance>
        ))}
      </ScrollView>

      <View style={[styles.bottomAction, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Button label="Raise New Request" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: theme.colors.textPrimary },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingHorizontal: 16 },
  tab: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: theme.colors.primary },
  tabText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.primary },
  list: { padding: 16, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  categoryText: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 12, color: theme.colors.textSecondary },
  ticketId: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: theme.colors.textSecondary },
  title: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: theme.colors.textPrimary, marginBottom: 4 },
  desc: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: theme.colors.textSecondary, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  time: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 12, color: theme.colors.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusInProgress: { backgroundColor: '#E3F2FD' },
  statusResolved: { backgroundColor: '#E8F5E9' },
  statusText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 10 },
  statusTextInProgress: { color: '#1565C0' },
  statusTextResolved: { color: '#2E7D32' },
  bottomAction: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: theme.colors.surface, padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.border }
});

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../src/components/ui/Text';
import { AnimatedEntrance } from '../../src/components/ui/AnimatedEntrance';
import { theme } from '../../src/theme';

const FIXTURES = [
  { id: '1', category: 'General', title: 'Diwali Celebration Preparations', desc: 'Decorations will start being put up in common areas this weekend.', date: 'Oct 24', priority: 'normal' },
  { id: '2', category: 'Security', title: 'New Gate Entry System', desc: 'Please ensure your app is updated to version 2.1 for the new QR code scanning at the main gate.', date: 'Oct 23', priority: 'high' },
];

export default function AnnouncementsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Announcements</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsWrapper} contentContainerStyle={styles.tabsContent}>
        {['all', 'general', 'maintenance', 'security'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list}>
        {FIXTURES.map((ann, index) => (
          <AnimatedEntrance key={ann.id} delay={100 + index * 100}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.category}>{ann.category}</Text>
                <Text style={styles.date}>{ann.date}</Text>
              </View>
              <Text style={styles.title}>{ann.title}</Text>
              <Text style={styles.desc}>{ann.desc}</Text>
              {ann.priority === 'high' && (
                <View style={styles.priorityBadge}>
                  <Feather name="alert-circle" size={12} color={theme.colors.error} />
                  <Text style={styles.priorityText}>High Priority</Text>
                </View>
              )}
            </View>
          </AnimatedEntrance>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: theme.colors.textPrimary },
  tabsWrapper: { maxHeight: 44, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  tabsContent: { paddingHorizontal: 16, alignItems: 'center' },
  tab: { paddingVertical: 12, marginRight: 24, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: theme.colors.primary },
  tabText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: theme.colors.textSecondary },
  tabTextActive: { color: theme.colors.primary },
  list: { padding: 16 },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 16, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  category: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 11, color: theme.colors.accent, textTransform: 'uppercase', letterSpacing: 1 },
  date: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 12, color: theme.colors.textSecondary },
  title: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: theme.colors.textPrimary, marginBottom: 6 },
  desc: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 12 },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FFEBEE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 10, color: theme.colors.error, marginLeft: 4 }
});

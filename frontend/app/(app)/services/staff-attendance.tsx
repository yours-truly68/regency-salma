import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../../src/components/ui/Text';
import { theme } from '../../../src/theme';

const CATEGORIES = [
  { id: '1', name: 'Security', present: 12, total: 12, icon: 'shield', color: '#1565C0' },
  { id: '2', name: 'Housekeeping', present: 8, total: 10, icon: 'home', color: '#2E7D32' },
  { id: '3', name: 'Plumbing', present: 2, total: 2, icon: 'tool', color: '#8B4513' },
  { id: '4', name: 'Electrician', present: 1, total: 2, icon: 'zap', color: '#E65100' },
  { id: '5', name: 'Landscaping', present: 4, total: 4, icon: 'feather', color: '#2E7D32' },
  { id: '6', name: 'Waste Management', present: 3, total: 3, icon: 'trash-2', color: '#616161' },
  { id: '7', name: 'Drivers', present: 5, total: 6, icon: 'truck', color: '#4527A0' },
];

export default function StaffAttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Attendance</Text>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="calendar" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.dateSelector}>
        <Feather name="chevron-left" size={20} color={theme.colors.textSecondary} />
        <Text style={styles.dateText}>Today, Oct 24</Text>
        <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {CATEGORIES.map((cat) => (
          <View key={cat.id} style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: `${cat.color}15` }]}>

              <Feather name={cat.icon as any} size={16} color={cat.color} />
            </View>
            <Text style={styles.name}>{cat.name}</Text>
            <View style={styles.counts}>
              <Text style={styles.present}>{cat.present}</Text>
              <Text style={styles.slash}>/</Text>
              <Text style={styles.total}>{cat.total}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: theme.colors.textPrimary },
  dateSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  dateText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15, color: theme.colors.textPrimary },
  list: { padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.03)' },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  name: { flex: 1, fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: theme.colors.textPrimary },
  counts: { flexDirection: 'row', alignItems: 'baseline' },
  present: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: theme.colors.textPrimary },
  slash: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: theme.colors.textSecondary, marginHorizontal: 2 },
  total: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: theme.colors.textSecondary },
});

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Text } from '../../../src/components/ui/Text';
import { ScreenEntrance } from '../../../src/components/ui/ScreenEntrance';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../../src/hooks/useScreenInsets';
import { theme } from '../../../src/theme';

const STAFF_LIST = [
  { id: '1', name: 'Security', icon: 'shield', iconBg: '#E8F5E9', iconColor: '#2E7D32', status: 'Present', count: '8 / 10' },
  { id: '2', name: 'Housekeeping', icon: 'home', iconBg: '#E3F2FD', iconColor: '#1976D2', status: 'Present', count: '6 / 8' },
  { id: '3', name: 'Plumbing', icon: 'tool', iconBg: '#EDE7F6', iconColor: '#512DA8', status: 'Present', count: '2 / 2' },
  { id: '4', name: 'Electrician', icon: 'zap', iconBg: '#FFF3E0', iconColor: '#F57C00', status: 'Present', count: '2 / 2' },
  { id: '5', name: 'Landscaping', icon: 'feather', iconBg: '#E8F5E9', iconColor: '#388E3C', status: 'Present', count: '3 / 4' },
  { id: '6', name: 'Waste Management', icon: 'trash-2', iconBg: '#FBE9E7', iconColor: '#D84315', status: 'Present', count: '4 / 5' },
  { id: '7', name: 'Drivers', icon: 'truck', iconBg: '#E0F7FA', iconColor: '#00838F', status: 'Present', count: '3 / 4' },
];

export default function StaffAttendanceScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(false);

  return (
    <View style={styles.container}>
      <AppHeader
        variant="subscreen"
        title="Staff Attendance"
        onBackPress={() => router.canGoBack() ? router.back() : router.replace('/services')}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]} showsVerticalScrollIndicator={false}>
        <ScreenEntrance delay={50}>
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderDate}>Today, 4 Jun 2026</Text>
            <Feather name="calendar" size={18} color={theme.colors.textSecondary} />
          </View>
        </ScreenEntrance>

        <ScreenEntrance delay={100}>
          <View style={styles.card}>
            {STAFF_LIST.map((staff, index) => (
              <View key={staff.id} style={[styles.staffRow, index === STAFF_LIST.length - 1 && styles.noBorder]}>
                <View style={[styles.iconContainer, { backgroundColor: staff.iconBg }]}>
                  <Feather name={staff.icon as React.ComponentProps<typeof Feather>['name']} size={18} color={staff.iconColor} />
                </View>
                
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>{staff.name}</Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{staff.status}</Text>
                </View>

                <Text style={styles.countText}>{staff.count}</Text>
              </View>
            ))}
          </View>
        </ScreenEntrance>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  subHeaderDate: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: '#ECFDF5',
    marginRight: 14,
  },
  statusText: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    color: '#059669',
  },
  countText: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 14,
    color: theme.colors.textPrimary,
    minWidth: 42,
    textAlign: 'right',
  },
});

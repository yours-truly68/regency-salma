import React from 'react';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, ScrollView, Switch, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../src/components/ui/Text';
import { PremiumPressable } from '../../src/components/ui/PremiumPressable';
import { ScreenEntrance } from '../../src/components/ui/ScreenEntrance';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { useScreenInsets } from '../../src/hooks/useScreenInsets';
import { theme } from '../../src/theme';
import { useSession } from '../../src/store/auth';
import { useAvailability, setAvailability } from '../../src/store/availability';

export default function ProfileScreen() {
  const router = useRouter();
  const { bottomClearance } = useScreenInsets(true);
  const { user, logout } = useSession();
  const displayName = user?.firstName || 'Rohan';
  const unit = user?.unitNumber || '9A';
  const role = user?.role ? (user.role === 'OWNER' ? 'Owner' : user.role === 'TENANT' ? 'Tenant' : user.role) : 'Owner';
  const email = user?.email || 'rohan.mehta@regencysalma.com';

  const isAway = useAvailability();

  return (
    <View style={styles.container}>
      <AppHeader
        variant="tabroot"
        title="Profile"
        rightAction={
          <PremiumPressable
            onPress={() => router.push('/(app)/profile-settings')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.settingsIconBtn}
          >
            <Feather name="settings" size={22} color={theme.colors.textPrimary} />
          </PremiumPressable>
        }
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomClearance }]} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <ScreenEntrance delay={50}>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=143D2A&color=fff&size=128` }}
              style={styles.avatar}
            />
            <Text style={styles.profileName}>{displayName}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{role}</Text>
              </View>
              <View style={styles.unitBadge}>
                <Text style={styles.unitBadgeText}>Unit {unit}</Text>
              </View>
            </View>
            <Text style={styles.profileContact}>{email} • +91 98765 43210</Text>
          </View>
        </ScreenEntrance>

        {/* Shortcuts */}
        <ScreenEntrance delay={100}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Home & Residence</Text>
            <View style={styles.card}>
              <PremiumPressable style={styles.menuRow} onPress={() => router.push('/my-home')}>
                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                  <Feather name="home" size={20} color={theme.colors.primary} />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuLabel}>My Home (Unit {unit})</Text>
                  <Text style={styles.menuDesc}>Tower A · 3 BHK · Penthouse A</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </PremiumPressable>

              <View style={styles.divider} />

              <PremiumPressable style={styles.menuRow} onPress={() => router.push('/family-members')}>
                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                  <Feather name="users" size={20} color="#1976D2" />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuLabel}>Family Members</Text>
                  <Text style={styles.menuDesc}>3 Active Residents</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </PremiumPressable>
            </View>
          </View>
        </ScreenEntrance>

        {/* Availability */}
        <ScreenEntrance delay={150}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Availability</Text>
            <View style={styles.card}>
              <View style={styles.menuRow}>
                <View style={[styles.iconBox, { backgroundColor: '#FFFDE7' }]}>
                  <Feather name="sun" size={20} color="#F57F17" />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuLabel}>Away Mode</Text>
                  <Text style={styles.menuDesc}>Pause regular deliveries and staff</Text>
                </View>
                <Switch
                  value={isAway}
                  onValueChange={setAvailability}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                />
              </View>
            </View>
          </View>
        </ScreenEntrance>

        {/* Account & Preferences */}
        <ScreenEntrance delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
              <PremiumPressable style={styles.menuRow} onPress={() => router.push('/calendar')}>
                <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                  <Feather name="calendar" size={20} color={theme.colors.accent} />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuLabel}>Community Calendar</Text>
                  <Text style={styles.menuDesc}>Events & scheduled maintenance</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </PremiumPressable>

              <View style={styles.divider} />

              <PremiumPressable style={styles.menuRow} onPress={() => router.push('/profile-settings')}>
                <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
                  <Feather name="lock" size={20} color="#7E22CE" />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuLabel}>Account Security & Settings</Text>
                  <Text style={styles.menuDesc}>Password, notifications, passcode</Text>
                </View>
                <Feather name="chevron-right" size={20} color={theme.colors.textSecondary} />
              </PremiumPressable>
            </View>
          </View>
        </ScreenEntrance>

        {/* Sign Out */}
        <ScreenEntrance delay={250}>
          <PremiumPressable style={styles.signOutBtn} onPress={logout}>
            <Feather name="log-out" size={18} color={theme.colors.error} style={{ marginRight: 8 }} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </PremiumPressable>
        </ScreenEntrance>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  settingsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
  },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 14 },
  profileName: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, letterSpacing: -0.4, color: theme.colors.textPrimary, marginBottom: 8 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  roleBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 },
  roleBadgeText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: theme.colors.primary },
  unitBadge: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 },
  unitBadgeText: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: theme.colors.textSecondary },
  profileContact: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, letterSpacing: -0.3, color: theme.colors.textPrimary, marginBottom: 12, marginLeft: 4 },
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
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  iconBox: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuInfo: { flex: 1 },
  menuLabel: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: theme.colors.textPrimary, marginBottom: 2 },
  menuDesc: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: theme.colors.textSecondary },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.05)', marginHorizontal: 18 },
  availabilityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1, paddingRight: 12 },
  availabilityTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: theme.colors.textPrimary, marginBottom: 2 },
  availabilitySubtitle: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: theme.colors.textSecondary },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 100,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    marginTop: 4,
    marginBottom: 20,
  },
  signOutText: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: theme.colors.error },
});
